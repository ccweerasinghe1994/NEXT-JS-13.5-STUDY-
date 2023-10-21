import { FC, ReactNode } from 'react';

type TLayoutProps = {
	children: ReactNode;
};
const Layout: FC<TLayoutProps> = ({ children }) => {
	return (
		<main className="flex min-h-screen w-full items-center justify-center">
			{children}
		</main>
	);
};

export default Layout;
