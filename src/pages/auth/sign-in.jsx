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
    try {
      const role = sessionStorage.getItem("role");
      if (role === "teacher") {
        navigate("/teacher/home");
      } else if (role === "admin") {
        navigate("/dashboard/home");
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
    }
  }, [navigate]);

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const jwt = credentialResponse.credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    const email = payload.email;
    const name = payload.name;

    // อนุญาตเฉพาะอีเมล @kmitl.ac.th
    if (!email.endsWith("@kmitl.ac.th")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only @kmitl.ac.th accounts are allowed!",
        confirmButtonText: "OK",
      });
      return;
    }

    // เงื่อนไขพิเศษสำหรับ email บางรายการ
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
          confirmButton: "bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const role = result.value;
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("name", name);

          const date = new Date().toISOString().slice(0, 19).replace("T", " ");
          if (role === "admin") {
            signInAPI(email, name, 2, date);
            addLogAPI(email, 0, 0);
            navigate("/dashboard/home");
          } else if (role === "teacher") {
            signInAPI(email, name, 1, date);
            addLogAPI(email, 0, 0);
            navigate("/teacher/home");
          }
        }
      });
      return;
    }

    // ตรวจสอบว่าเป็นนิสิตหรือไม่ (usernamePart เป็นตัวเลข 8 หลัก)
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
      // อาจารย์
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome, Teacher: ${email}`,
        confirmButtonText: "OK",
      }).then(() => {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("role", "teacher");

        const date = new Date().toISOString().slice(0, 19).replace("T", " ");
        signInAPI(email, name, 1, date);
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
    <GoogleOAuthProvider clientId="440768325473-uq45q4cqueh029ovpq29m16nh28rlg9f.apps.googleusercontent.com">
      <section className="flex flex-wrap items-center justify-center min-h-screen bg-gray-300">
        <div className="w-full lg:w-1/2 p-8">
          {/* โลโก้ */}
          <div className="flex justify-center mt-4 py-5 px-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/KMITL_Sublogo.svg/768px-KMITL_Sublogo.svg.png"
              alt="KMITL Logo"
              className="w-64 h-auto"
            />
            <img
              src="https://img5.pic.in.th/file/secure-sv1/DALLE-2025-01-05-14.14.45---A-bright-and-futuristic-circular-logo-design-for-a-virtual-reality-VR-application-focused-on-circuit-building.-The-logo-features-a-sleek-VR-headset.png"
              alt="VR Logo"
              className="w-32 h-auto"
            />
          </div>

          <div className="bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <div className="bg-orange-500 text-white py-4 px-6">
              <h1 className="text-lg font-bold text-center">
                KMITL Registration System
              </h1>
            </div>

            <div className="p-6 text-center">
              <Typography variant="h3" className="font-bold text-gray-800">
                ยืนยันตัวตนด้วยบริการของ Google
              </Typography>
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-lg font-normal mt-2"
              >
                โดยใช้ Email Account ของสถาบันฯ
              </Typography>
              <div className="max-w-md mx-auto mt-6">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  uxMode="redirect"
                  redirectUri="https://smith11.ce.kmitl.ac.th/auth/sign-in"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-full lg:w-1/2">
          <img
            src="https://img2.pic.in.th/pic/DALLE-2025-01-05-14.21.58---A-person-wearing-a-sleek-and-modern-VR-headset-with-a-distinctively-Thai-cultural-twist.-The-individual-is-dressed-in-a-contemporary-Thai-inspired-out.jpg"
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>
    </GoogleOAuthProvider>
  );
}

export default SignIn;
