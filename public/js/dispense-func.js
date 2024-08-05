const overlay = document.getElementById('overlay');

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded and DOM fully loaded");

    function formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) {
            console.error('Invalid date:', dateString);
            return '';
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    document.getElementById("date_issued").value = getCurrentDate();

    function fillInputs(unq_id, full_name, gender, full_address, phone, age, medicine, quantity, dosage, doctor_name, receiver, relationship) {
        console.log("Filling inputs with:", { unq_id, full_name, gender, full_address, phone, age, medicine, quantity, dosage, doctor_name, receiver, relationship });
        document.getElementById('unq_id').value = unq_id;
        document.getElementById('beneficiary_name').value = full_name;
        document.getElementById('beneficiary_gender').value = gender;
        document.getElementById('beneficiary_address').value = full_address;
        document.getElementById('beneficiary_contact').value = phone;
        document.getElementById('beneficiary_age').value = age;
        document.getElementById('product_details').value = medicine;
        document.getElementById('quantity').value = quantity;
        document.getElementById('dosage').value = dosage;
        document.getElementById('prescribing_doctor').value = doctor_name;
        document.getElementById('requesting_person').value = receiver;
        document.getElementById('relationship_beneficiary').value = relationship;

        const event = new Event('input', { bubbles: true, cancelable: true });
        document.getElementById('product_details').dispatchEvent(event);
    }

    function attachRowClickHandlers() {
        const rows = document.querySelectorAll("#mainTable tbody tr");
        rows.forEach((row) => {
            row.addEventListener("click", () => {
                console.log("Row clicked:", row);

                const unq_id = row.getAttribute("data-unq_id");
                const beneficiary_name = row.getAttribute("data-full_name");
                const beneficiary_gender = row.getAttribute("data-gender");
                const beneficiary_address = row.getAttribute("data-full_address");
                const beneficiary_contact = row.getAttribute("data-phone");
                const beneficiary_age = row.getAttribute("data-age");
                const product_details = row.getAttribute("data-medicine");
                const quantity = row.getAttribute("data-quantity");
                const dosage = row.getAttribute("data-dosage");
                const prescribing_doctor = row.getAttribute("data-doctor_name");
                const requesting_person = row.getAttribute("data-receiver");
                const relationship_beneficiary = row.getAttribute("data-relationship");

                fillInputs(
                    unq_id,
                    beneficiary_name,
                    beneficiary_gender,
                    beneficiary_address,
                    beneficiary_contact,
                    beneficiary_age,
                    product_details,
                    quantity,
                    dosage,
                    prescribing_doctor,
                    requesting_person,
                    relationship_beneficiary
                );

                const dispenseForm = document.getElementById('dispenseForm');
                if (dispenseForm) {
                    overlay.style.display = "block";
                    dispenseForm.style.display = 'block';
                } else {
                    console.error('Dispense form not found.');
                }
            });
        });
    }

    document.getElementById('closeDispenseBtn').addEventListener('click', function () {
        const dispenseForm = document.getElementById('dispenseForm');
        if (dispenseForm) {
            overlay.style.display = "none";
            dispenseForm.style.display = 'none';
        } else {
            console.error('Dispense form not found.');
        }
    });
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        dispenseForm.style.display = "none";
      });

    attachRowClickHandlers();

    const productDetailsElement = document.getElementById('product_details');
    if (productDetailsElement) {
        console.log('Product element found:', productDetailsElement);

        productDetailsElement.addEventListener('input', function () {
            const query = this.value;
            console.log('Input event triggered with query:', query);

            if (query.length > 0) {
                console.log('Starting fetch call with query:', query);
                fetch(`/get?query=${encodeURIComponent(query)}`)
                    .then(response => {
                        console.log('Fetch response status:', response.status);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Fetched data:', data);

                        if (data && data.batch_number && data.expiration) {
                            document.getElementById('batch_number').value = data.batch_number;
                            document.getElementById('expiration_date').value = formatDate(data.expiration);
                        } else {
                            console.log('No batch number or expiration date found in data');
                            document.getElementById('batch_number').value = '';
                            document.getElementById('expiration_date').value = '';
                        }
                    })
                    .catch(error => console.error('Error during fetch:', error));
            } else {
                console.log('Query is empty, clearing batch number and expiration date');
                document.getElementById('batch_number').value = '';
                document.getElementById('expiration_date').value = '';
            }
        });
    } else {
        console.error('Element not found: product_details');
    }
});



function toggleNav() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
        if (sidebar.style.width === '400px') {
            sidebar.style.width = '0';
        } else {
            sidebar.style.width = '400px';
        }
    } else {
        console.error('Sidebar not found.');
    }
}
