        let generatedOTP;

        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }

        document.getElementById('sendCodeBtn').addEventListener('click', function() {
            const phoneNumber = document.getElementById('phoneNumber').value;
            if (phoneNumber.length === 10) {
                generatedOTP = generateOTP();
                Swal.fire({
                    title: 'OTP Sent!',
                    text: `Your OTP is: ${generatedOTP}`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    document.getElementById('phone-login-form').style.display = 'none';
                    document.getElementById('verification-form').style.display = 'block';
                    document.getElementById('otp-display').style.display = 'block';
                    document.getElementById('otp-display').textContent = `OTP sent to +91 ${phoneNumber}: ${generatedOTP}`;
                });
            } else {
                Swal.fire({
                    title: 'Invalid Number',
                    text: 'Please enter a valid 10-digit phone number',
                    icon: 'error'
                });
            }
        });

        document.getElementById('verifyCodeBtn').addEventListener('click', function() {
            const enteredOTP = document.getElementById('verificationCode').value;
            
            if (enteredOTP === generatedOTP) {
                Swal.fire({
                    title: 'Success!',
                    text: 'OTP verified successfully',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'Profile.html';
                });
            } else {
                Swal.fire({
                    title: 'Invalid OTP',
                    text: 'Please enter the correct 6-digit OTP',
                    icon: 'error'
                });
            }
        });

        document.getElementById('resendCodeBtn').addEventListener('click', function(e) {
            e.preventDefault();
            generatedOTP = generateOTP();
            const phoneNumber = document.getElementById('phoneNumber').value;
            Swal.fire({
                title: 'OTP Resent!',
                text: `New OTP: ${generatedOTP}`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                document.getElementById('otp-display').textContent = `New OTP sent to +91 ${phoneNumber}: ${generatedOTP}`;
            });
        });

        document.getElementById('changePhoneBtn').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('verification-form').style.display = 'none';
            document.getElementById('phone-login-form').style.display = 'block';
            document.getElementById('phoneNumber').value = '';
            document.getElementById('otp-display').style.display = 'none';
            document.getElementById('verificationCode').value = '';
        });
   