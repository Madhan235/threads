import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";

export default function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}
