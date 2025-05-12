const country_Url = " https://obscure-fortnight-q76jr4v9wwqrh4pp5-6006.app.github.dev/country";

fetch(country_Url).then(response=>{
    if(!response.ok)
        throw new Error("Failed to Fetch country Data");
    return response.json();
}).then(data=>{
    const tbody =document.querySelector("#countrytable tbody");

    data.forEach(country=>{
        const row = document.createElement("tr");
        row.innerHTML =`
        <td>${country.country_id}</td>
        <td>${country.country_name}</td>
        <td>${country.region_id}</td>
        `;

        tbody.appendChild(row);
    });
}).catch(
    err=>{
        console.log(err.message);
    }
);