"use client";

import { useEffect, useState } from "react";
import useEmployee from "../../hooks/useEmployee";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Navbar() {

  const { employees, loading } = useEmployee();

  const [currentUser, setCurrentUser] = useState(null);


  // Get logged-in user email
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

  }, []);



  // Find logged-in employee/admin from DB data
  const employee = employees?.find((emp) => {

    const dbEmail =
      emp.emailid || emp.EmailID;

    return (
      dbEmail?.toLowerCase() ===
      currentUser?.email?.toLowerCase()
    );

  });



  return (

    <header className="navbar">


      {/* Left */}

      <div>

      
          <h1>SWAIS Employees</h1>
        


        <p className="navbar-subtitle">
          <p>Welcome to SWAIS Employees</p>
        </p>

      </div>





      {/* Right Profile */}

      <div
        className="profile"
        style={{
          display:"flex",
          alignItems:"center",
          gap:"15px"
        }}
      >


        <div className="profile-info">


          <h4>

            {
              loading
              ? "Loading..."
              :
              employee?.employeename ||
              employee?.EmployeeName ||
              ""
            }

          </h4>



          <span>

            {
              loading
              ? ""
              :
              employee?.designation ||
              employee?.Designation ||
              employee?.department ||
              employee?.Department ||
              ""
            }

          </span>



        </div>





        {/* Image */}

        {
          (employee?.photourl || employee?.PhotoURL) &&

          <img

            src={
              `${API_URL}${
                employee?.photourl ||
                employee?.PhotoURL
              }?t=${Date.now()}`
            }


            alt="Profile"


            style={{
              width:"50px",
              height:"50px",
              borderRadius:"50%",
              objectFit:"cover",
              border:"2px solid #2563eb"
            }}

          />

        }



      </div>


    </header>

  );

}