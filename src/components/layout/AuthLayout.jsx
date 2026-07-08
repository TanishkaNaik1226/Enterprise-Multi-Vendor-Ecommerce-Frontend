
import AuthContainer from "./AuthContainer";
import AuthInfo from "./AuthInfo";

function AuthLayout({ children }) {
  return (
    <AuthContainer>
      <div className="grid w-full lg:grid-cols-2 gap-16 p-8 md:p-12 lg:p-16">

        {/* Left Section */}
        <div className="flex items-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center">
          <AuthInfo />
        </div>

      </div>
    </AuthContainer>
  );
}

export default AuthLayout;
