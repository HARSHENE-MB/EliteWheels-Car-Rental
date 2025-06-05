document.addEventListener('DOMContentLoaded', function () {

	document.querySelector('.step-item[data-step="1"]').classList.add('active');
	document.getElementById('step1').classList.add('active');

    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const stepItems = document.querySelectorAll('.step-item');
    const formSections = document.querySelectorAll('.form-section');

	nextButtons.forEach(button => {
	    button.addEventListener('click', function () {
	        const nextStep = this.getAttribute('data-next');
	        const currentSection = document.querySelector('.form-section.active');
	        const currentStepNum = parseInt(currentSection.id.replace('step', ''));

	    
	        const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
	        let isValid = true;

	        inputs.forEach(input => {
	            if (!input.checkValidity()) {
	                input.classList.add('is-invalid');
	                isValid = false;
	            } else {
	                input.classList.remove('is-invalid');
	            }
	        });

	        if (!isValid) return;

	        
	        stepItems.forEach(item => item.classList.remove('active'));
	        document.querySelector(`.step-item[data-step="${nextStep}"]`).classList.add('active');

	      
	        formSections.forEach(section => section.classList.remove('active'));
	        document.getElementById(`step${nextStep}`).classList.add('active');
	    });
	});

    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const prevStep = this.getAttribute('data-prev');

            stepItems.forEach(item => item.classList.remove('active'));
            document.querySelector(`.step-item[data-step="${prevStep}"]`).classList.add('active');

            
            formSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`step${prevStep}`).classList.add('active');
        });
    });

    
    const profilePhotoInput = document.getElementById('profilePhoto');
    const idProofInput = document.getElementById('idProof');

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', function () {
            const preview = document.getElementById('profilePreview');
            previewImage(this, preview);
        });
    }

    if (idProofInput) {
        idProofInput.addEventListener('change', function () {
            const preview = document.getElementById('idPreview');
            if (this.files[0] && this.files[0].type.startsWith('image/')) {
                previewImage(this, preview);
            } else {
                preview.style.display = 'none';
            }
        });
    }

    function previewImage(input, imgElement) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imgElement.src = e.target.result;
                imgElement.style.display = 'block';
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

	const form = document.getElementById('registrationForm');
	const notificationBox = document.getElementById('successNotification');

	if (form) {
	    form.addEventListener('submit', function (event) {
	        if (!form.checkValidity()) {
	            event.preventDefault();
	            event.stopPropagation();

	            const invalidInputs = form.querySelectorAll(':invalid');
	            if (invalidInputs.length > 0) {
	                let firstInvalidStep = null;
	                formSections.forEach((section, index) => {
	                    if (section.contains(invalidInputs[0])) {
	                        firstInvalidStep = index + 1;
	                    }
	                });

	                if (firstInvalidStep) {
	                    stepItems.forEach(item => item.classList.remove('active'));
	                    document.querySelector(`.step-item[data-step="${firstInvalidStep}"]`).classList.add('active');

	                    formSections.forEach(section => section.classList.remove('active'));
	                    document.getElementById(`step${firstInvalidStep}`).classList.add('active');
	                }
	            }
	        } else {
	            
	            const phone = document.getElementById('phone').value;
	            localStorage.setItem('registeredPhone', phone);

	          
	        }

	        form.classList.add('was-validated');
	    });
	}


    // Phone number validation
	const phoneInput = document.querySelector('input[th\\:field="*{phone}"]');

	if (phoneInput) {
	    phoneInput.addEventListener('input', debounce(function () {
	        if (this.value.length > 10) {
	            this.value = this.value.slice(0, 10);
	        }

	        const firstDigit = this.value.charAt(0);
	        const errorMessageElement = this.closest('.mb-3').querySelector('.invalid-feedback');

	        if (this.value.length > 0 && !['6', '7', '8', '9'].includes(firstDigit)) {
	            this.setCustomValidity('Phone number must start with 6, 7, 8, or 9');
	            this.classList.add('is-invalid');
	            if (errorMessageElement) {
	                errorMessageElement.textContent = 'Phone number must start with 6, 7, 8, or 9';
	            }
	        } else {
	            this.setCustomValidity('');
	            this.classList.remove('is-invalid');
	            if (errorMessageElement) {
	                errorMessageElement.textContent = 'Please enter a valid 10-digit Indian mobile number';
	            }
	        }
	    }, 300));
	}


    const pincodeInput = document.getElementById('pincode');

    if (pincodeInput) {
        pincodeInput.addEventListener('input', function () {
            if (this.value.length > 6) {
                this.value = this.value.slice(0, 6);
            }
        });
    }

  
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }


    formSections.forEach(section => {
        section.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const nextBtn = section.querySelector('.next-btn');
                if (nextBtn) {
                    e.preventDefault();
                    nextBtn.click();
                }
            }
        });
    });

    
    const invalidInputs = form.querySelectorAll(':invalid');
    if (invalidInputs.length > 0) {
        invalidInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
