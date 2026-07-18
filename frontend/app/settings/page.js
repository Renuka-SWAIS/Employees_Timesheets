"use client";

import { useEffect, useRef, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import useEmployee from "../../hooks/useEmployee";
import EditProfileModal from "../../components/employees/EditProfileModal";


const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2006";


export default function SettingsPage() {


  const { employees, loading } = useEmployee();


  const fileInputRef = useRef(null);


  const [showEditModal,setShowEditModal] = useState(false);

  const [profile,setProfile] = useState(null);

  const [isAdmin,setIsAdmin] = useState(false);

  const [profileLoading,setProfileLoading] = useState(true);



  // ==============================
  // Load Profile
  // ==============================


  useEffect(()=>{


    const storedUser =
    localStorage.getItem("user");


    console.log(
      "LOCAL STORAGE USER:",
      storedUser
    );


    if(!storedUser){
        return;
    }


    const user =
    JSON.parse(storedUser);



    console.log(
      "USER OBJECT:",
      user
    );



    if(
      user.RoleType?.toLowerCase()
      ===
      "admin"
    ){


        console.log(
          "ADMIN PROFILE"
        );


        setIsAdmin(true);

        setProfile(user);

        setProfileLoading(false);


        return;

    }



    console.log(
      "EMPLOYEE PROFILE"
    );


    loadEmployeeProfile(
      user.EmailID
    );



},[employees]);



  // ==============================
  // Employee Profile
  // ==============================


  function loadEmployeeProfile(email){


    if(!employees || employees.length===0)
      return;



    const user =
      employees.find(
        emp =>
        emp.EmailID?.toLowerCase()
        ===
        email.toLowerCase()
      );



    if(user){

      setProfile(user);

      setProfileLoading(false);

    }



  }





  // ==============================
  // Admin Profile
  // ==============================


  async function loadAdminProfile(email){


    try{


      const response =
      await fetch(
        `${API_URL}/admin/profile/${email}`
      );



      if(!response.ok)
        throw new Error();



      const data =
      await response.json();



      setProfile(data);



    }
    catch(error){


      console.error(
        "Admin profile error",
        error
      );


    }
    finally{


      setProfileLoading(false);


    }


  }







if(profileLoading){


    return(

      <MainLayout>

        <h2>
          Loading Profile...
        </h2>


      </MainLayout>

    );


  }







  if(!profile){


    return(

      <MainLayout>


        <h2>
          Profile Not Found
        </h2>


      </MainLayout>

    );


  }







  // ==============================
  // Upload Photo
  // ==============================


  async function uploadPhoto(event){


    const file =
    event.target.files[0];



    if(!file)
      return;



    const formData =
    new FormData();


    formData.append(
      "photo",
      file
    );



    try{


      const response =
      await fetch(

        `${API_URL}/profile/${profile.EmployeeID || profile.AdminID}/photo`,

        {

          method:"POST",

          body:formData

        }

      );



      if(!response.ok)
        throw new Error();



      alert(
        "Photo uploaded successfully"
      );


      window.location.reload();


    }
    catch(error){


      console.log(error);


      alert(
        "Photo upload failed"
      );


    }


  }








  // ==============================
  // Update Profile
  // ==============================


  async function saveProfile(data){


    try{


      const id =
      profile.EmployeeID || profile.AdminID;



      const response =
      await fetch(

        `${API_URL}/profile/${id}`,

        {

          method:"PUT",

          headers:{

            "Content-Type":
            "application/json"

          },


          body:
          JSON.stringify(data)


        }

      );



      if(!response.ok)
        throw new Error();



      alert(
        "Profile Updated Successfully"
      );


      setShowEditModal(false);


      window.location.reload();


    }
    catch(error){


      console.log(error);


      alert(
        "Update failed"
      );


    }


  }







return(


<MainLayout>



<h1>
⚙️ {isAdmin ? "Admin Profile" : "Employee Profile"}
</h1>



<p
style={{
color:"#666",
marginBottom:30
}}
>

Manage your profile information.

</p>





<div

style={{

background:"#fff",

borderRadius:15,

padding:35,

maxWidth:650,

margin:"auto",

boxShadow:"0 4px 12px rgba(0,0,0,.08)"

}}

>



<div

style={{

display:"flex",

alignItems:"center",

gap:25,

marginBottom:35

}}

>



<img


src={

profile.PhotoURL

?

`${API_URL}${profile.PhotoURL}?t=${Date.now()}`


:

`https://ui-avatars.com/api/?name=${encodeURIComponent(
profile.EmployeeName || profile.Name
)}`

}


alt="profile"


style={{

width:120,

height:120,

borderRadius:"50%",

objectFit:"cover",

border:"4px solid #2563eb"

}}


/>






<div>


<h2>

{profile.EmployeeName || profile.Name}

</h2>



<p>

{profile.Designation || profile.Role}

</p>



<span

style={{

background:"#dcfce7",

padding:"6px 15px",

borderRadius:20,

fontWeight:600

}}

>

{profile.Status || "Active"}

</span>


</div>


</div>







<table

style={{

width:"100%",

borderCollapse:"collapse"

}}

>


<tbody>



{
!isAdmin &&

<tr>

<td>
<b>
Employee Code
</b>
</td>

<td>
{profile.EmployeeCode}
</td>

</tr>

}



<tr>

<td>
<b>
Email
</b>
</td>

<td>
{profile.EmailID || profile.Email}
</td>

</tr>




<tr>

<td>
<b>
Department
</b>
</td>

<td>
{profile.Department || "-"}
</td>

</tr>





<tr>

<td>
<b>
Role
</b>
</td>

<td>
{profile.RoleType || profile.Role}
</td>

</tr>




</tbody>


</table>






<input

ref={fileInputRef}

type="file"

accept="image/*"

style={{
display:"none"
}}

onChange={uploadPhoto}

/>






<div

style={{

display:"flex",

gap:15,

marginTop:35

}}

>


<button

onClick={()=>
fileInputRef.current.click()
}

style={{

padding:"12px 22px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:8,

cursor:"pointer"

}}

>

Upload Photo

</button>





<button

onClick={()=>
setShowEditModal(true)
}

style={{

padding:"12px 22px",

background:"#0f766e",

color:"#fff",

border:"none",

borderRadius:8,

cursor:"pointer"

}}

>

Edit Profile

</button>



</div>



</div>






{

showEditModal &&

<EditProfileModal

employee={profile}

onClose={()=>
setShowEditModal(false)
}

onSave={saveProfile}

/>


}



</MainLayout>


);


}