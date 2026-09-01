import { Button } from "@/components/ui/button";

const Register = () => {
  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-col p-2 border rounded-sm">
        <div className="text-center">
          <h1> Create Your Account </h1>
          <p>Join thousands of tool renters today</p>
        </div>
        <div>
          <div>
            <label> Full Name</label>
            <input type="text" name="username" id="" placeholder="Kyle Crane" />
          </div>
          <div>
            <label> email</label>
            <input
              type="email"
              name="email"
              id=""
              placeholder="kyleCrane@gmail.com"
            />
          </div>
          <div>
            <label> Password </label>
            <input
              type="password"
              name="password"
              id=""
              placeholder="****************"
            />
          </div>
          <div>
            <label> Confirm Password</label>
            <input type="password" name="" id="" placeholder="************" />
          </div>
        </div>
        <Button variant={"default"}>Create Account</Button>
        <p>
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
      <span> Already have an account? Sign in here</span>
    </div>
  );
};

export default Register;
