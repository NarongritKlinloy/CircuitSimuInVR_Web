import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import { signInAPI } from "@/data/sign-in-user";
import { useEffect } from "react";
import { addLogAPI } from "@/data/log";

export function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const jwt = credentialResponse.credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    const email = payload.email;
    const name = payload.name;

    if (!email.endsWith("@kmitl.ac.th")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only @kmitl.ac.th accounts are allowed!",
        confirmButtonText: "OK",
      });
      return;
    }

    // เงื่อนไขพิเศษสำหรับ email ทีม Dev
    if (
      email === "65015041@kmitl.ac.th" ||
      email === "65015123@kmitl.ac.th" ||
      email === "65015101@kmitl.ac.th" ||
      email === "65015168@kmitl.ac.th" ||
      email === "boomza53214@gmail.com"
    ) {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome, ${email} Developer team`,
        input: "select",
        inputOptions: {
          admin: "Admin",
          teacher: "Teacher",
        },
        inputPlaceholder: "Select your role",
        confirmButtonText: "Proceed",
        customClass: {
          confirmButton:
            "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const role = result.value;
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("name", name);


          if (role === "admin") {
            signInAPI(email, name, 2);
            addLogAPI(email, 0, 0);
            navigate("/dashboard/home");
          } else if (role === "teacher") {
            signInAPI(email, name, 1);
            addLogAPI(email, 0, 0);
            navigate("/teacher/home");
          }
        }
      });
      return;
    }

    // ตรวจสอบรูปแบบอีเมล ถ้าขึ้นต้นเป็นตัวเลข 8 หลัก
    const usernamePart = email.split("@")[0];
    const isNumber = /^\d{8}$/;

    if (isNumber.test(usernamePart)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to access the admin system.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/auth/sign-in");
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome, Teacher: ${email}`,
        confirmButtonText: "OK",
      }).then(() => {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("role", "teacher");

        signInAPI(email, name, 1);
        addLogAPI(email, 0, 0);

        navigate("/teacher/home");
      });
    }
  };

  const handleGoogleLoginError = () => {
    Swal.fire({
      icon: "error",
      title: "Google Login Failed",
      text: "Please try again!",
      confirmButtonText: "OK",
    });
  };

  return (
    <GoogleOAuthProvider clientId="536241701089-ej2lkeskgljs17a9dp6d3eeorfhb2f2e.apps.googleusercontent.com">
      <section className="flex flex-wrap items-center justify-center min-h-screen bg-[url('https://img5.pic.in.th/file/secure-sv1/65395415_9563801.jpg')] bg-cover bg-center">
        <div className="w-full lg:w-1/2 p-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-center mt-4 py-5 px-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/KMITL_Sublogo.svg/768px-KMITL_Sublogo.svg.png"
                alt="KMITL Logo"
                className="w-64 h-auto"
              />
              <img
                src="https://img5.pic.in.th/file/secure-sv1/11zon_croppedba3732dd0cac4716.png"
                alt="VR Logo"
                className="w-32 h-auto"
              />
            </div>
            <div className="p-6 text-center">
              <Typography variant="h3" className="font-bold text-gray-800">
                KMITL Registration System
              </Typography>
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-lg font-normal mt-2"
              >
                ใช้ Email Account ของสถาบันฯ
              </Typography>
              {/* เพิ่ม flex justify-center เพื่อให้ปุ่มอยู่ตรงกลาง */}
              <div className="max-w-md mx-auto mt-6 mb-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  prompt="select_account"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
}

export default SignIn;
