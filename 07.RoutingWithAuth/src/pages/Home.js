import { useSelector } from "react-redux";

export const Home = () => {
  const user = useSelector((state) => state.auth.user);

  console.log({ user });

  return (
    <div>
      <h1>Home</h1>
      <p>Welcom {user?.name}</p>
    </div>
  );
};
