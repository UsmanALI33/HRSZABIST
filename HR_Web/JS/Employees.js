const country_Url = " https://obscure-fortnight-q76jr4v9wwqrh4pp5-6006.app.github.dev/country";

fetch(country_Url).then(response=>{
    if(!response.ok)
        throw new Error("Failed to Fetch country Data");
    return response.json();
}).then(data=>{
    const tbody =document.querySelector("#countrytable tbody");

    data.forEach(employees=>{
        const row = document.createElement("tr");
        row.innerHTML =`
        <td>${employees.employee_id}</td>
        <td>${employees.first_name}</td>
        <td>${employees.last_name}</td>
         <td>${employees.email}</td>
        <td>${employees.phone_number}</td>
        <td>${employees.hire_date}</td>

               <td>${employees.job_id}</td>
        <td>${employees.salary}</td>
         <td>${employees.commission_pct}</td>
        <td>${employees.manager_id}</td>
        <td>${employees.department_id}</td>
        `;

        tbody.appendChild(row);
    });
}).catch(
    err=>{
        console.log(err.message);
    }
);