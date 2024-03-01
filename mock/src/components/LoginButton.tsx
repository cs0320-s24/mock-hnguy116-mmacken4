import { Dispatch, SetStateAction } from "react";

/**
 * Login props
 */
interface loginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

/**
 * Login button -- sets login state
 * @param props
 * @returns
 */
export function LoginButton(props: loginProps) {
  const authenticate = () => {
    const newValue = !props.isLoggedIn;
    props.setIsLoggedIn(newValue);
    return newValue;
  };
  if (props.isLoggedIn) {
    return (
      <button aria-label="Sign Out" onClick={authenticate}>
        Sign out
      </button>
    );
  } else {
    return (
      <button aria-label="Login" onClick={authenticate}>
        Login
      </button>
    );
  }
}
