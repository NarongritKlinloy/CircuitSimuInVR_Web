import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

export function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const EnterSignIn = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่า Email กรอกหรือไม่
    if (!username.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in your Email.',
        confirmButtonText: 'OK', // ข้อความบนปุ่ม
        customClass: {
          confirmButton: 'bg-blue-500 text-white rounded px-4 py-2', // สไตล์ Tailwind
        },
      });
      return; // ออกจากฟังก์ชัน
    }

    // ตรวจสอบว่า Password กรอกหรือไม่
    if (!password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in your Password.',
        confirmButtonText: 'OK', // ข้อความบนปุ่ม
        customClass: {
          confirmButton: 'bg-blue-500 text-white rounded px-4 py-2', // สไตล์ Tailwind
        },
      });
      return; // ออกจากฟังก์ชัน
    }

    // ตรวจสอบว่าช่อง Email เป็น @kmitl.ac.th หรือไม่
    if (!username.endsWith('@kmitl.ac.th')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Username',
        text: 'Username must end with @kmitl.ac.th!',
      });
    } else if (username === 'admin@kmitl.ac.th' && password === 'password') {
      navigate('/dashboard/home');
    } else if (username === 'teacher@kmitl.ac.th' && password === 'password' || username === 'teacher@kmitl.ac.th' && password === '1234') {
      navigate('/teacher/home');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password.',
      });
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const jwt = credentialResponse.credential;
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    const email = payload.email;

    if (!email.endsWith('@kmitl.ac.th')) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only @kmitl.ac.th accounts are allowed!',
      });
      return;
    }

    const usernamePart = email.split('@')[0];
    const isNumber = /^\d{8}$/;

    if (isNumber.test(usernamePart)) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You are not authorized to access the admin system.',
      }).then(() => {
        navigate('/dashboard/home');
      });;
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome, Teacher: ${email}`,
      }).then(() => {
        navigate('/teacher/home');
      });
    }
  };

  const handleGoogleLoginError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Google Login Failed',
      text: 'Please try again!',
    });
  };

  return (
    <GoogleOAuthProvider clientId="289166698407-3sivu8jo52aveuuh78kg8n17agseta42.apps.googleusercontent.com">
      <section className="m-8 flex gap-4">
        <div className="w-full lg:w-3/5 mt-24">

          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Management system</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
              Enter your email and password to Sign In.
            </Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={EnterSignIn}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Email
              </Typography>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="lg"
                placeholder="johnnonlen@kmitl.ac.th"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Password
              </Typography>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                placeholder="**********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
            </div>
            <div className="flex items-center justify-between gap-2 mt-6">

              <div
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center justify-start font-medium"
                  >
                    I agree the&nbsp;
                    <a
                      href="#"
                      className="font-normal text-black transition-colors hover:text-gray-900 underline"
                    >
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />

              <Typography variant="small" className="font-medium text-gray-900">
                <a href="#">
                  Forgot Password
                </a>
              </Typography>
            </div>

            <Button className="mt-3" fullWidth type="submit">
              Sign In
            </Button>

            <div className="space-y-4 mt-8">
              {/* Google Login Button */}
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
            </div>

            {/*   
            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Not registered?
              <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
            </Typography>
            */}

          </form>
        </div>

        <div className="w-2/5 h-full hidden lg:block">
          <img
            src="https://img.freepik.com/premium-photo/futuristic-virtual-reality-concept-futuristic-man-vr-glasses-with-3d-illustration_780593-19006.jpg"
            className="h-full w-full object-cover rounded-3xl"
          />
        </div>
      </section>
    </GoogleOAuthProvider>
  );
}

export default SignIn;
