import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

export const metadata = {
	title: 'Next.js 13 with Clerk'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body>{children}</body>
			</html>
		</ClerkProvider>
	);
}
