import ExpenditureBook from "../models/ExpenditureBook.model.js";
import mongoose from "mongoose";

// Add new expenditure entry (SPC or Admin)
export const addExpenditure = async (req, res) => {
  try {
    const { expenditure, description } = req.body;

    const newEntry = new ExpenditureBook({
      expenditure,
      description,
      date: new Date(), // If date is not provided, use current date
    });

    await newEntry.save();
    res
      .status(201)
      .json({ message: "Expenditure entry added successfully", newEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding expenditure entry", error });
  }
};

// Update an expenditure entry (SPC or Admin)
export const updateExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const entry = await ExpenditureBook.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Expenditure entry not found" });
    }

    await ExpenditureBook.updateOne({ _id: id }, updateData);
    res.status(200).json({ message: "Expenditure entry updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating expenditure entry", error });
  }
};

// Fetch all expenditure entries with total expenditure
export const getAllExpenditures = async (req, res) => {
  try {
    const expenditures = await ExpenditureBook.find({});
    // .populate('company', 'name') // Populate company details if needed
    // .exec();

    // const totalExpenditure = await ExpenditureBook.aggregate([
    //   { $group: { _id: null, total: { $sum: "$expenditure" } } },
    // ]);

    res.status(200).json({
      expenditures
    //   totalExpenditure: totalExpenditure[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error });
  }
};

// Fetch expenditure entries based on date or company
export const getFilteredExpenditures = async (req, res) => {
  try {
    const { date, company } = req.query;
    const filter = {};

    if (date) {
      filter.date = new Date(date);
    }
    if (company) {
      filter.company = mongoose.Types.ObjectId(company);
    }

    const expenditures = await ExpenditureBook.find(filter)
      .populate("company", "name")
      .exec();

    res.status(200).json(expenditures);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error retrieving filtered expenditure entries",
        error,
      });
  }
};
