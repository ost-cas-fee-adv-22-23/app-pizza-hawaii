import { FC, ReactElement } from "react";

type HeaderProps = {
  title: string;
  children?: ReactElement;
};

export const Header: FC<HeaderProps> = ({ children, title }: HeaderProps) => {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  );
};
