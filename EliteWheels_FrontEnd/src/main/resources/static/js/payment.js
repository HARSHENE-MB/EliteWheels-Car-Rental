document.addEventListener('DOMContentLoaded', function() {
      
            const paymentMethods = document.querySelectorAll('.payment-method');
            const paymentContents = document.querySelectorAll('.payment-content');
            
            paymentMethods.forEach(method => {
                method.addEventListener('click', function() {
                    const targetMethod = this.getAttribute('data-method');
                 
                    paymentMethods.forEach(m => m.classList.remove('active'));
                    this.classList.add('active');
                  
                    paymentContents.forEach(content => content.classList.remove('active'));
                    document.getElementById(`${targetMethod}-content`).classList.add('active');
                });
            });
          
            const upiOptions = document.querySelectorAll('.upi-option');
            upiOptions.forEach(option => {
                option.addEventListener('click', function() {
                    upiOptions.forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                    
                    const upiType = this.getAttribute('data-upi');
                    const upiInput = document.getElementById('upi-id');
                    
                    if (upiType === 'gpay') {
                        upiInput.value = 'username@okicici';
                    } else if (upiType === 'phonepe') {
                        upiInput.value = 'username@ybl';
                    } else if (upiType === 'paytm') {
                        upiInput.value = 'username@paytm';
                    } else {
                        upiInput.value = '';
                    }
                });
            });
            
            // Bank Option Selection
            const bankOptions = document.querySelectorAll('.bank-option');
            bankOptions.forEach(option => {
                option.addEventListener('click', function() {
                    bankOptions.forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                    
                   
                    const bankType = this.getAttribute('data-bank');
                    const bankSelect = document.getElementById('bank-select');
                    bankSelect.value = bankType;
                });
            });
            
            // Form Validation
            const cardForm = document.getElementById('card-form');
            const upiForm = document.getElementById('upi-form');
            const netbankingForm = document.getElementById('netbanking-form');
            const successPopup = document.getElementById('success-popup');
            
            // Credit Card Validation
            cardForm.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                
                // Card Number Validation
                const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
                if (!/^\d{16}$/.test(cardNumber)) {
                    document.getElementById('card-number-error').classList.add('visible');
                    isValid = false;
                } else {
                    document.getElementById('card-number-error').classList.remove('visible');
                }
                
                // Card Name Validation
                const cardName = document.getElementById('card-name').value.trim();
                if (cardName.length < 3) {
                    document.getElementById('card-name-error').classList.add('visible');
                    isValid = false;
                } else {
                    document.getElementById('card-name-error').classList.remove('visible');
                }
                
                // Expiry Date Validation
                const expiryDate = document.getElementById('expiry-date').value;
                if (!/^\d{2}\/\d{4}$/.test(expiryDate)) {
                    document.getElementById('expiry-date-error').classList.add('visible');
                    isValid = false;
                } else {
                    const [month, year] = expiryDate.split('/');
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth() + 1;
                    
                    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth) || parseInt(month) > 12) {
                        document.getElementById('expiry-date-error').classList.add('visible');
                        isValid = false;
                    } else {
                        document.getElementById('expiry-date-error').classList.remove('visible');
                    }
                }
                
                // CVV Validation
                const cvv = document.getElementById('cvv').value;
                if (!/^\d{3}$/.test(cvv)) {
                    document.getElementById('cvv-error').classList.add('visible');
                    isValid = false;
                } else {
                    document.getElementById('cvv-error').classList.remove('visible');
                }
                
                if (isValid) {
                  
                    successPopup.classList.add('active');
                    setTimeout(() => {
                        window.location.href = '#confirmation';
                    }, 3000);
                }
            });
            
       
            document.getElementById('card-number').addEventListener('input', function() {
                let value = this.value.replace(/\D/g, ''); 
                let formattedValue = '';
                
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedValue += ' ';
                    }
                    formattedValue += value[i];
                }
                
                this.value = formattedValue;
            });
            
            document.getElementById('expiry-date').addEventListener('input', function() {
                let value = this.value.replace(/\D/g, ''); 
                
                if (value.length > 2) {
                    this.value = value.substring(0, 2) + '/' + value.substring(2);
                } else {
                    this.value = value;
                }
            });
            
           
            upiForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const upiId = document.getElementById('upi-id').value.trim();
                
                if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upiId)) {
                    document.getElementById('upi-id-error').classList.add('visible');
                } else {
                    document.getElementById('upi-id-error').classList.remove('visible');
                    successPopup.classList.add('active');
                    setTimeout(() => {
                        window.location.href = '#confirmation';
                    }, 3000);
                }
            });
            
            netbankingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const bankSelect = document.getElementById('bank-select').value;
                
                if (!bankSelect) {
                    document.getElementById('bank-select-error').classList.add('visible');
                } else {
                    document.getElementById('bank-select-error').classList.remove('visible');
                    successPopup.classList.add('active');
                    setTimeout(() => {
                        window.location.href = '#confirmation';
                    }, 3000);
                }
            });
        });
		
		
		
		
		document.addEventListener("DOMContentLoaded", () => {
		    const profileIcon = document.getElementById("profileIcon");
		    const dropdownMenu = document.getElementById("profileDropdownMenu");
		    const userNameDisplay = document.getElementById("userNameDisplay");

		    const user = sessionStorage.getItem("user"); 

		    dropdownMenu.innerHTML = "";

		    if (user) {
		        const parsedUser = JSON.parse(user); 

		        
		        userNameDisplay.textContent = parsedUser.firstName || "User";
		        userNameDisplay.classList.remove("d-none");

		    
		        dropdownMenu.innerHTML = `
		            <a href="/profile" class="dropdown-item">Profile</a>
		            <a href="#" id="logoutButton" class="dropdown-item">Logout</a>
		        `;
		    } else {
		       
		        userNameDisplay.classList.add("d-none");

		        dropdownMenu.innerHTML = `
		            <a href="/login" class="dropdown-item">Login</a>
		        `;
		    }

		    // logout
		    dropdownMenu.addEventListener("click", function (e) {
		        if (e.target && e.target.id === "logoutButton") {
		            e.preventDefault();
		            sessionStorage.clear();
		            bootstrap.Dropdown.getOrCreateInstance(profileIcon).hide();
		            window.location.href = "/login";
		        }
		    });
		});
		document.getElementById('pickupDate').focus();

		
		document.getElementById("confirmBtn").addEventListener("click", function () {
		       const section = document.getElementById("paymentSection");
		       if (section) {
		           section.scrollIntoView({ behavior: "smooth" });
		       }
		   });
		   
		   
		   
		   
		   function updateCarPreview() {
		          
		          const selectedCarData = sessionStorage.getItem('selectedCar');
		          let carName = 'Car not selected';
		          if (selectedCarData) {
		              const selectedCar = JSON.parse(selectedCarData);
		              carName = selectedCar.brand.brandName + ' ' + selectedCar.model;
		          }

		         
		          const pickupDate = document.getElementById('pickupDate').value;
		          const dropDate = document.getElementById('dropDate').value;
		          const pickupLocation = document.getElementById('pickupLocation').value;

		          let durationText = 'Duration not available';
		          if (pickupDate && dropDate) {
		              const start = new Date(pickupDate);
		              const end = new Date(dropDate);
		              const timeDiff = end - start;
		              const days = timeDiff / (1000 * 60 * 60 * 24);
		              durationText = days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Same day';
		          }

		        
		          document.getElementById('carName').textContent = carName;
		          document.getElementById('pickupInfo').textContent = pickupDate ? `Pickup: ${formatDateTime(pickupDate, '10:00 AM')}` : '';
		          document.getElementById('returnInfo').textContent = dropDate ? `Return: ${formatDateTime(dropDate, '10:00 AM')}` : '';
		          document.getElementById('locationInfo').textContent = pickupLocation ? `Location: ${pickupLocation}` : '';
		          document.getElementById('durationInfo').textContent = durationText;
		      }

		     
		      function formatDateTime(dateStr, timeStr) {
		          const options = { year: 'numeric', month: 'long', day: 'numeric' };
		          const formattedDate = new Date(dateStr).toLocaleDateString(undefined, options);
		          return `${formattedDate} - ${timeStr}`;
		      }

		     
		      document.getElementById("confirmBtn").addEventListener("click", function () {
		          updateCarPreview();
		          document.getElementById("paymentSection").scrollIntoView({ behavior: "smooth" });
		      });
			  
			  
			  
			  
			  function calculateBilling() {
			          const selectedCarData = sessionStorage.getItem('selectedCar');
			          let ratePerHour = 0;

			          if (selectedCarData) {
			              const selectedCar = JSON.parse(selectedCarData);
			              ratePerHour = selectedCar.rentalRate || 0;
			          }

			          const pickupDate = document.getElementById('pickupDate').value;
			          const dropDate = document.getElementById('dropDate').value;

			          let rentalFee = 0;
			          if (pickupDate && dropDate) {
			              const start = new Date(pickupDate);
			              const end = new Date(dropDate);
			              const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24)); 
			              rentalFee = ratePerHour * 24 * days;
			          }

			          const taxes = 99.00;
			          const discount = 99.00;
			          const total = rentalFee + taxes - discount;

			          const formattedAmount = `₹${total.toFixed(2)}`;

			          document.getElementById('rentalFee').textContent = formattedAmount;
			          document.getElementById('totalAmount').textContent = formattedAmount;

			     
			          document.getElementById('confirm-card-payment').textContent = `Pay ${formattedAmount}`;
			          document.getElementById('confirm-upi-payment').textContent = `Pay ${formattedAmount}`;
			          document.getElementById('confirm-netbank-payment').textContent = `Pay ${formattedAmount}`;
			      }

			      document.getElementById("confirmBtn").addEventListener("click", function () {
			          updateCarPreview();
			          calculateBilling();
			          document.getElementById("paymentSection").scrollIntoView({ behavior: "smooth" });
			      });
				  
	
				  const jsConfetti = new JSConfetti();
				  
				  function postBooking() {
				      const selectedCar = JSON.parse(sessionStorage.getItem('selectedCar'));
				      const loggedInUser = JSON.parse(sessionStorage.getItem('user')); // Must be stored in sessionStorage

				      const pickupDate = document.getElementById('pickupDate').value;
				      const dropDate = document.getElementById('dropDate').value;
				      const pickupLocation = document.getElementById('pickupLocation').value;
				      const dropoffLocation = document.getElementById('dropoffLocation').value;

				      if (!selectedCar || !loggedInUser || !pickupDate || !dropDate || !pickupLocation || !dropoffLocation) {
				          alert("Missing required booking data.");
				          return;
				      }

				      const startDateTime = new Date(pickupDate);
				      const endDateTime = new Date(dropDate);
				      const durationDays = Math.max(1, (endDateTime - startDateTime) / (1000 * 60 * 60 * 24));

				      const rentalRatePerHour = selectedCar.rentalRate || 0;
				      const rentalFee = rentalRatePerHour * 24 * durationDays;
				      const totalPrice = rentalFee + 99 - 99; 

				      const bookingPayload = {
				          pickupLocation: pickupLocation,
				          dropLocation: dropoffLocation,
				          startDatetime: startDateTime.toISOString(),
				          endDatetime: endDateTime.toISOString(),
				          status: "CONFIRMED",
				          totalPrice: totalPrice,
				          withDriver: false,
				          driverId: null,
				          carId: selectedCar.carId,
				          userId: loggedInUser.userId
				      };

				      fetch("http://localhost:8081/api/bookings", {
				          method: "POST",
				          headers: {
				              "Content-Type": "application/json"
				          },
				          body: JSON.stringify(bookingPayload)
				      })
				      .then(response => {
				          if (!response.ok) throw new Error("Failed to book car");
				          return response.json();
				      })
				      .then(data => {
						const modal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));
						        modal.show();
						        jsConfetti.addConfetti();
								
								
								
								    sessionStorage.removeItem('selectedCar');

								    
								    const steps = document.querySelectorAll('.progress-steps .step');
								    if (steps.length >= 3) {
								        
								        steps[1].classList.remove('active');
								        steps[1].classList.add('completed');

								       
								        steps[2].classList.add('completed');
								    }
								
								
								setTimeout(() => {
								        const referrer = document.referrer;
								        if (referrer) {
								            window.location.href = referrer;
								        } else {
								            window.location.href = "/"; 
								        }
								    }, 3000); 
				      })
				      .catch(error => {
				          alert("Error: " + error.message);
				          console.error("Booking error:", error);
				      });
				  }

				  ["confirm-card-payment", "confirm-upi-payment", "confirm-netbank-payment"].forEach(id => {
				      document.getElementById(id).addEventListener("click", function (e) {
				          e.preventDefault();
				          postBooking();
				      });
				  });
