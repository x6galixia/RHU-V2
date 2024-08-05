document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById('overlay');
    function formatDate(dateString) {
        if (!dateString || dateString === 'Invalid Date') {
            return '';
        }
        const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    }

    function fillInputs(
        beneficiary_name,
        beneficiary_gender,
        beneficiary_address,
        beneficiary_contact,
        beneficiary_age,
        senior_citizen,
        pwd,

        transaction_number,
        product_details,
        quantity,
        batch_number,
        expiration_date,
        date_issued,
        prescribing_doctor,
        requesting_person,
        relationship_beneficiary
    ) {
        document.querySelector('input[name="beneficiary_name"]').value = beneficiary_name || '';
        document.querySelector('input[name="beneficiary_gender"]').value = beneficiary_gender || '';
        document.querySelector('input[name="beneficiary_address"]').value = beneficiary_address || '';
        document.querySelector('input[name="beneficiary_contact"]').value = beneficiary_contact || '';
        document.querySelector('input[name="beneficiary_age"]').value = beneficiary_age || '';
        document.querySelector('input[name="senior_citizen"]').value = senior_citizen || '';
        document.querySelector('input[name="pwd"]').value = pwd || '';

        const tableBody = document.querySelector('#beneficiaryIndexForm table tbody');
        tableBody.innerHTML = '';

        for (let i = 0; i < transaction_number.length; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span>${transaction_number[i] || ''}</span><br></td>
                <td><span>${product_details[i] || ''}</span><br></td>
                <td><span>${quantity[i] || ''}</span><br></td>
                <td><span>${batch_number[i] || ''}</span><br></td>
                <td><span>${formatDate(expiration_date[i])}</span><br></td>
                <td><span>${formatDate(date_issued[i])}</span><br></td>
                <td><span>${prescribing_doctor[i] || ''}</span><br></td>
                <td><span>${requesting_person[i] || ''}</span><br></td>
                <td><span>${relationship_beneficiary[i] || ''}</span><br></td>
            `;
            tableBody.appendChild(row);
        }
    }

    function attachRowClickHandlers() {
        const rows = document.querySelectorAll("tbody tr");
        rows.forEach((row) => {
            row.addEventListener("click", () => {
                const beneficiary_name = row.getAttribute("data-beneficiary_name");
                const beneficiary_gender = row.getAttribute("data-beneficiary_gender");
                const beneficiary_address = row.getAttribute("data-beneficiary_address");
                const beneficiary_contact = row.getAttribute("data-beneficiary_contact");
                const beneficiary_age = row.getAttribute("data-beneficiary_age");
                const senior_citizen = row.getAttribute("data-senior_citizen");
                const pwd = row.getAttribute("data-pwd");

                const transaction_number = row.getAttribute("data-transaction_number").split(',');
                const product_details = row.getAttribute("data-product_details").split(',');
                const quantity = row.getAttribute("data-quantity").split(',');
                const batch_number = row.getAttribute("data-batch_number").split(',');
                const expiration_date = row.getAttribute("data-expiration_date").split(',');
                const date_issued = row.getAttribute("data-date_issued").split(',');
                const prescribing_doctor = row.getAttribute("data-prescribing_doctor").split(',');
                const requesting_person = row.getAttribute("data-requesting_person").split(',');
                const relationship_beneficiary = row.getAttribute("data-relationship_beneficiary").split(',');

                fillInputs(
                    beneficiary_name,
                    beneficiary_gender,
                    beneficiary_address,
                    beneficiary_contact,
                    beneficiary_age,
                    senior_citizen,
                    pwd,
                    transaction_number,
                    product_details,
                    quantity,
                    batch_number,
                    expiration_date,
                    date_issued,
                    prescribing_doctor,
                    requesting_person,
                    relationship_beneficiary
                );
                overlay.style.display = "block";
                document.getElementById('beneficiaryIndexForm').style.display = 'block';
            });
        });
    }

    document.getElementById('closeIndexBtn').addEventListener('click', function () {
        overlay.style.display = "none";
        document.getElementById('beneficiaryIndexForm').style.display = 'none';
    });

    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        beneficiaryIndexForm.style.display = "none";
    });

    attachRowClickHandlers();
});

function toggleNav() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar.style.width === '300px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '300px';
    }
}
