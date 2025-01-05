import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function SignIn({ backgroundImage }) {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const jwt = credentialResponse.credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    const email = payload.email;

    if (!email.endsWith("@kmitl.ac.th")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only @kmitl.ac.th accounts are allowed!",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome, ${email}`,
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/dashboard/home");
    });
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
    <GoogleOAuthProvider clientId="289166698407-3sivu8jo52aveuuh78kg8n17agseta42.apps.googleusercontent.com">
      <div
        className="min-h-screen bg-cover bg-center flex flex-col justify-center sm:py-12"
        style={{
          backgroundImage: `url('${backgroundImage || "https://img2.pic.in.th/pic/2212.w019.n002.800B.p15.800.jpg"}')`,
        }}
      >
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginError}
                      render={(renderProps) => (
                        <button
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <svg
                            className="h-6 w-6 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="-0.5 0 48 48"
                            version="1.1"
                          >
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                <g id="Google" transform="translate(401.000000, 860.000000)">
                                  <path
                                    d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                    fill="#FBBC05"
                                  ></path>
                                  <path
                                    d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                    fill="#EB4335"
                                  ></path>
                                  <path
                                    d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                    fill="#34A853"
                                  ></path>
                                  <path
                                    d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                    fill="#4285F4"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                          <span>Continue with Google</span>
                        </button>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
