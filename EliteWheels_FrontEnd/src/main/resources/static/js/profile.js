document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.profile-content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                const target = this.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
		

		    document.addEventListener('DOMContentLoaded', () => {
		        const user = JSON.parse(sessionStorage.getItem('user'));

		        if (!user) {
		            window.location.href = '/login';
		            return;
		        }


		        // Set name
		        document.getElementById('firstName').textContent = user.firstName;

		        // Set registration date
		        const date = new Date(user.registeredAt);
		        const options = { year: 'numeric', month: 'long' };
		        document.getElementById('registeredDate').textContent = `Member since ${date.toLocaleDateString(undefined, options)}`;

		        // Set role badge
		        const roleBadge = document.getElementById('roleBadge');
		        roleBadge.textContent = user.role.roleName;
		        roleBadge.className = user.role.roleName === 'Admin' ? 'badge bg-danger me-1' : 'badge bg-primary me-1';

		       
				const status = user.status || 'active'; 
				    const statusBadge = document.getElementById('statusBadge');
				    statusBadge.textContent = status === 'active' ? 'Verified' : 'Inactive';
				    statusBadge.className = status === 'active' ? 'badge bg-success' : 'badge bg-secondary';
					
				
					    const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`;
					    document.getElementById('fullName').textContent = fullName.trim() || '-';

					   
					    document.getElementById('email').textContent = user.email || '-';

				
					    document.getElementById('phoneNumber').textContent = user.phone || '-';
						document.getElementById('license').textContent = user.driverLicenseNumber || '-';

					    document.getElementById('emergencyContact').textContent = user.emergencyContact || 'N/A';

					    document.getElementById('address').textContent = `${user.address}, ${user.state}, ${user.pincode}` || '-';

						document.getElementById("name").value = fullName || "-";
						document.getElementById("emailInput").value = user.email || "-";
						document.getElementById("phoneInput").value = user.phone || "-";
		    });
			
			
			function updateUserContact() {
			    const user = JSON.parse(sessionStorage.getItem("loggedInUser")); // Get user from session
			    if (!user) {
			        alert("User not logged in.");
			        return;
			    }

			    const userId = user.userId;
			    const email = document.getElementById('emailInput').value;
			    const phone = document.getElementById('phoneInput').value;

			    const formData = new FormData();
			    formData.append("firstName", user.firstName);
			    formData.append("middleName", user.middleName || "");
			    formData.append("lastName", user.lastName);
			    formData.append("dob", user.dob);
			    formData.append("gender", user.gender);
			    formData.append("nationality", user.nationality);
			    formData.append("occupation", user.occupation);
			    formData.append("email", email);
			    formData.append("phone", phone);
			    formData.append("address", user.address);
			    formData.append("state", user.state);
			    formData.append("pincode", user.pincode);
			    formData.append("idProofType", user.idProofType);
			    formData.append("termsAndConditions", user.termsAndConditions);
			    formData.append("dataHandlingConsent", user.dataHandlingConsent);
			    formData.append("roleId", user.role.roleId);
			    formData.append("drivingLicenseNumber", user.driverLicenseNumber || "");

			   
			    formData.append("profilePhoto", new Blob([], { type: 'application/octet-stream' }), "empty.jpg");
			    formData.append("idProof", new Blob([], { type: 'application/pdf' }), "empty.pdf");

			    fetch(`http://localhost:8081/api/users/${userId}`, {
			        method: "PUT",
			        body: formData
			    })
			    .then(response => {
			        if (!response.ok) throw new Error("Failed to update user");
			        return response.json();
			    })
			    .then(updatedUser => {
			        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
			        alert("Contact details updated successfully!");
			    })
			    .catch(error => {
			        console.error("Update error:", error);
			        alert("An error occurred while updating contact details.");
			    });
			}



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
			
			
			
			
			
			
			document.addEventListener("DOMContentLoaded", function () {
			    const user = JSON.parse(sessionStorage.getItem("user"));
			    if (!user || !user.userId) {
			        alert("User not found in session.");
			        return;
			    }

			    fetch(`http://localhost:8081/api/bookings/user/${user.userId}`)
			        .then(response => response.json())
			        .then(bookings => {
			            const tbody = document.querySelector("#rental-history tbody");
			            tbody.innerHTML = ""; 

			            bookings.forEach(booking => {
			                const row = document.createElement("tr");

			                const carName = booking.car ? `${booking.car.brand?.brandName || ''} ${booking.car.model || ''}` : "Unknown";
			                const rentalDate = new Date(booking.startDatetime).toLocaleDateString('en-GB', {
			                    day: 'numeric', month: 'short', year: 'numeric'
			                });
			                const returnDate = new Date(booking.endDatetime).toLocaleDateString('en-GB', {
			                    day: 'numeric', month: 'short', year: 'numeric'
			                });
			                const totalCost = `₹${booking.totalPrice.toLocaleString()}`;

							const now = new Date();
							    const startDate = new Date(booking.startDatetime);
							    const endDate = new Date(booking.endDatetime);

							    let dynamicStatus = "confirmed";
							    if (now >= startDate && now <= endDate) {
							        dynamicStatus = "in progress";
							    } else if (now > endDate) {
							        dynamicStatus = "completed";
							    }

							    let statusLabel = dynamicStatus.charAt(0).toUpperCase() + dynamicStatus.slice(1);
							    let statusClass = {
							        "confirmed": "bg-warning",
							        "in progress": "bg-primary",
							        "completed": "bg-success"
							    }[dynamicStatus] || "bg-secondary";

			                const statusBadge = `<span class="badge ${statusClass}">${statusLabel}</span>`;

			                let actions = "";
			                if (booking.status === "completed") {
			                    actions = `
			                        <button class="btn btn-sm btn-outline-secondary">Receipt</button>
			                        <button class="btn btn-sm btn-outline-primary">Review</button>
			                    `;
			                } else if (booking.status === "in progress") {
			                    actions = `
			                        <button class="btn btn-sm btn-outline-danger">Report Issue</button>
			                        <button class="btn btn-sm btn-outline-warning">Extend</button>
			                    `;
			                } else if (booking.status === "confirmed") {
			                    actions = `
			                        <button class="btn btn-sm btn-outline-danger">Cancel</button>
			                    `;
			                }

			                row.innerHTML = `
			                    <td>${carName}</td>
			                    <td>${rentalDate}</td>
			                    <td>${returnDate}</td>
			                    <td>${totalCost}</td>
			                    <td>${statusBadge}</td>
			                   <!-- <td>${actions}</td> -->
			                `;
			                tbody.appendChild(row);
			            });
			        })
			        .catch(error => {
			            console.error("Error fetching bookings:", error);
			            alert("Failed to load rental history.");
			        });
			});

			
			
			
			
			
			
			document.addEventListener("DOMContentLoaded", function () {
			    const user = JSON.parse(sessionStorage.getItem("user"));
			    if (!user || !user.userId) {
			        console.error("User not found in session.");
			        return;
			    }

			    const userId = user.userId;
			    const now = new Date();

			    fetch(`http://localhost:8081/api/bookings/user/${userId}`)
			        .then(response => response.json())
			        .then(bookings => {
			            const upcoming = bookings.filter(b => new Date(b.startDatetime) > now);

			            const reservationsContainer = document.querySelector("#upcoming-reservations .row");
			            reservationsContainer.innerHTML = ""; 

			            if (upcoming.length === 0) {
			                reservationsContainer.innerHTML = `<p class="text-muted ms-3">No upcoming reservations found.</p>`;
			                return;
			            }

			            upcoming.forEach(booking => {
			                const card = document.createElement("div");
			                card.className = "col-md-6 mb-4";

			                const carName = booking.car ? `${booking.car.brand?.brandName || ''} ${booking.car.model || ''}` : "Car Info";
			                const pickup = new Date(booking.startDatetime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
			                const drop = new Date(booking.endDatetime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
			                const location = booking.pickupLocation || "Not Available";
			                const total = `₹${booking.totalPrice.toLocaleString()}`;

			                card.innerHTML = `
			                    <div class="card h-100">
			                        <div class="card-body">
			                            <h5 class="card-title">${carName}</h5>
			                            <p class="card-text"><strong>Pickup:</strong> ${pickup}</p>
			                            <p class="card-text"><strong>Return:</strong> ${drop}</p>
			                            <p class="card-text"><strong>Location:</strong> ${location}</p>
			                            <p class="card-text"><strong>Total:</strong> ${total}</p>
			                            <div class="mt-3">
			                              <!--  <button class="btn btn-sm btn-outline-primary">Modify</button> -->
										  <button class="btn btn-sm btn-outline-danger cancel-booking" data-id="${booking.bookingId}">Cancel</button>
			                            </div>
			                        </div>
			                    </div>
			                `;

			                reservationsContainer.appendChild(card);
			            });
			        })
			        .catch(error => {
			            console.error("Error fetching bookings:", error);
			        });
			});
			
			
			
			document.addEventListener('click', async function (e) {
			    if (e.target.classList.contains('cancel-booking')) {
			        const bookingId = e.target.getAttribute('data-id');

			        if (!bookingId) {
			            alert("Booking ID not found.");
			            return;
			        }

			        const confirmDelete = confirm("Are you sure you want to cancel this booking?");
			        if (!confirmDelete) return;

			        try {
			            const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}`, {
			                method: 'DELETE'
			            });

			            if (response.status === 204) {
			               
			                alert("Booking cancelled successfully.");
			                
			                const card = e.target.closest('.card');
			                if (card) card.remove();
			            } else {
			                const msg = await response.text();
			                alert("Failed to cancel booking: " + msg);
			            }
			        } catch (err) {
			            console.error("Error cancelling booking:", err);
			            alert("Error occurred while cancelling booking.");
			        }
			    }
			});

			
			
			
			
			
			
			document.addEventListener('DOMContentLoaded', function () {
				const user = JSON.parse(sessionStorage.getItem("user"));
							    if (!user || !user.userId) {
							        console.error("User not found in session.");
							        return;
							    }

							    const userId = user.userId;
			    const container = document.getElementById('documentContainer');

			    fetch(`http://localhost:8081/api/users/${userId}`)
			      .then(res => res.json())
			      .then(data => {
					
					const profileImg = document.getElementById('profileImage');
					        if (data.profilePhoto) {
				
					          if (data.profilePhoto.startsWith('data:image')) {
					            profileImg.src = data.profilePhoto;
					          } else {
					            
					            profileImg.src = "data:image/jpeg;base64," + data.profilePhoto;
					          }
					        } else {
					          profileImg.src = 'default-avatar.png'; 
					        }
							
							
							const docs = [
							  { title: "Aadhaar Card", status: "Verified", badgeClass: "bg-success" }
							];

			        docs.forEach(doc => {
			          const card = document.createElement('div');
			          card.className = 'col-md-4';
			          card.innerHTML = `
			            <div class="card document-card">
			              <i class="bi bi-card-image mb-3"></i>
			              <h6>${doc.title}</h6>
			              <span class="badge ${doc.badgeClass} mb-2">${doc.status}</span>
			              <button class="btn btn-sm btn-outline-primary">View</button>
			            </div>`;
			          container.appendChild(card);
					  
					  
					 
					  const documentsBase64 = {
					    driversLicense: data.driversLicenseBase64,  
					    aadhaarCard: data.idProofPdf
					  };

					  document.querySelectorAll('.document-card button').forEach((btn, index) => {
					    btn.addEventListener('click', () => {
					      const modalBody = document.querySelector('#documentModal .modal-body');
					      modalBody.innerHTML = ''; 

						  let docKey;
						  switch (index) {
						    case 0: docKey = 'aadhaarCard'; break;
						    default: docKey = null;
						  }

					      if (docKey && documentsBase64[docKey]) {
					        const base64Data = documentsBase64[docKey];
							const prefix = "data:image/png;base64,";
							const base64Full = prefix + base64Data;


					        if (base64Data.startsWith('data:application/pdf')) {
					        
					          modalBody.innerHTML = `<iframe src="${base64Full}" width="100%" height="500px"></iframe>`;
					        } else {
					          
					          modalBody.innerHTML = `<img src="${base64Full}" alt="${docKey}" class="img-fluid" />`;
					        }

					        const modal = new bootstrap.Modal(document.getElementById('documentModal'));
					        modal.show();
					      } else {
					        modalBody.innerHTML = '<p>No document available.</p>';
					        const modal = new bootstrap.Modal(document.getElementById('documentModal'));
					        modal.show();
					      }
					    });
					  });


					  
			        });
			      })
			      .catch(err => {
			        console.error('Error fetching user data:', err);
			        container.innerHTML = `<p class="text-danger">Failed to load documents.</p>`;
			      });
			  });
			  
			  
			  document.getElementById('saveBtn').addEventListener('click', function () {
			      Swal.fire({
			        icon: 'success',
			        title: 'Changes saved..!!',
			        showConfirmButton: false,
			        timer: 1500
			      });
			    });
				
				
				
				