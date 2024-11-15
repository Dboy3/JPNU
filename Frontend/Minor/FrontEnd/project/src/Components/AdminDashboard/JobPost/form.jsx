<form onSubmit={handleSubmit(onSubmit)}>
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Company Name</label>
                 <input {...register("companyName", { required: true })} className="border px-4 py-2 rounded w-full" />
                 {errors.companyName && <p className="text-red-500 text-sm">Company Name is required</p>}
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Roles</label>
                 <input {...register("roles", { required: true })} className="border px-4 py-2 rounded w-full" placeholder="Separate roles with commas" />
                 {errors.roles && <p className="text-red-500 text-sm">Roles are required</p>}
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Employment Type</label>
                 <div>
                   <input type="checkbox" name="fullTime" onChange={handleEmploymentTypeChange} />
                   <label className="ml-2">Full-Time</label>
                   <input type="checkbox" name="internship" onChange={handleEmploymentTypeChange} className="ml-4" />
                   <label className="ml-2">Internship</label>
                 </div>
               </div>
     
               {showCtc && (
                 <div className="mb-4">
                   <label className="block text-sm font-medium mb-2">CTC</label>
                   <input type="number" {...register("ctc", { required: showCtc })} className="border px-4 py-2 rounded w-full" />
                   {errors.ctc && <p className="text-red-500 text-sm">CTC is required</p>}
                 </div>
               )}
     
               {showStipend && (
                 <div className="mb-4">
                   <label className="block text-sm font-medium mb-2">Stipend</label>
                   <input type="number" {...register("stipend", { required: showStipend })} className="border px-4 py-2 rounded w-full" />
                   {errors.stipend && <p className="text-red-500 text-sm">Stipend is required</p>}
                 </div>
               )}
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Eligible Courses</label>
                 <select {...register("eligibleCourses", { required: true })} className="border px-4 py-2 rounded w-full">
                   <option value="">Select Course</option>
                   <option value="software engineer">Software Engineer</option>
                   <option value="civil">Civil</option>
                   <option value="electrical">Electrical</option>
                   <option value="electronics">Electronics</option>
                   <option value="mechanical">Mechanical</option>
                 </select>
                 {errors.eligibleCourses && <p className="text-red-500 text-sm">Eligible Courses are required</p>}
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Required CGPA</label>
                 <input type="number" step="0.1" min="0" max="10" {...register("requiredCgpa", { required: true })} className="border px-4 py-2 rounded w-full" />
                 {errors.requiredCgpa && <p className="text-red-500 text-sm">Required CGPA is necessary</p>}
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Job Location</label>
                 <input {...register("location", { required: true })} className="border px-4 py-2 rounded w-full" placeholder="Separate locations with commas" />
                 {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Other Details</label>
                 <textarea {...register("otherDetails")} className="border px-4 py-2 rounded w-full"></textarea>
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Registration Start Date</label>
                 <input type="date" {...register("registrationStartDate", { required: true })} className="border px-4 py-2 rounded w-full" />
                 {errors.registrationStartDate && <p className="text-red-500 text-sm">Start date is required</p>}
               </div>
     
               <div className="mb-4">
                 <label className="block text-sm font-medium mb-2">Registration End Date</label>
                 <input type="date" {...register("registrationEndDate", { required: true })} className="border px-4 py-2 rounded w-full" />
                 {errors.registrationEndDate && <p className="text-red-500 text-sm">End date is required</p>}
               </div>
     
               <div className="flex justify-end space-x-2">
                 <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                 <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{currentJob ? "Update Job" : "Add Job"}</button>
               </div>
             </form>