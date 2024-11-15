import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlacedStudentsData, getPlacedStudentsData } from './placedStudentsSlice';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const History = () => {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.placedStudents.status);
    const students = useSelector(getPlacedStudentsData);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPlacedStudentsData());
        }
    }, [dispatch, status]);

    // Process data for Bar Chart (Average Packages by Year)
    const averagePackagesByYear = students.reduce((acc, student) => {
        const { year, ctc } = student;
        if (!acc[year]) {
            acc[year] = { total: 0, count: 0 };
        }
        acc[year].total += ctc;
        acc[year].count += 1;
        return acc;
    }, {});

    const barChartData = {
        labels: Object.keys(averagePackagesByYear),
        datasets: [
            {
                label: 'Average Package (₹)',
                data: Object.keys(averagePackagesByYear).map(
                    (year) => averagePackagesByYear[year].total / averagePackagesByYear[year].count
                ),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Year',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Average Package (₹)',
                },
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`,
                },
            },
        },
    };

    // Process data for Pie Chart (CTC Contribution by Company)
    const ctcByCompany = students.reduce((acc, student) => {
        const { companyName, ctc } = student;
        if (!acc[companyName]) {
            acc[companyName] = 0;
        }
        acc[companyName] += ctc;
        return acc;
    }, {});

    const pieChartData = {
        labels: Object.keys(ctcByCompany),
        datasets: [
            {
                label: 'Total CTC (₹)',
                data: Object.values(ctcByCompany),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                ],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
        },
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Placed Students Analysis</h1>
            {status === 'loading' && <p className="text-center">Loading...</p>}
            {status === 'failed' && <p className="text-danger text-center">Error fetching data!</p>}

            {status === 'succeeded' && (
                <>
                    {/* Bar Chart Section */}
                    <section className="mb-5">
                        <h2 className="text-center mb-3">Average Package by Year</h2>
                        <div style={{ width: '80%', margin: '0 auto' }}>
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    </section>

                    {/* Pie Chart Section */}
                    <section>
                        <h2 className="text-center mb-3">CTC Contribution by Company</h2>
                        <div style={{ width: '60%', margin: '0 auto' }}>
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default History;
