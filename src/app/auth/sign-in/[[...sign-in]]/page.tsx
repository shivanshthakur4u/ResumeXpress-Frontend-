import { SignIn } from "@clerk/nextjs";


function Signin() {
  return (
    <div className="flex justify-center my-20 items-center">
      <SignIn />
    </div>
  );
}

export default Signin;
