import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import './globals.css';
// eslint-disable-next-line camelcase
import {Inter,Space_Grotesk} from 'next/font/google';

import type {Metadata} from "next";
const inter = Inter({
	subsets: ['latin'],
	weight:['100','200','300','400','500','600','700','800','900'],
	variable:'--font-inter',
});
const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight:['300','400','500','600','700'],
	variable:'--font-spaceGrotesk',
});


export const metadata:Metadata = {
	title: 'StackFlow',
	description:'StackFlow is a Q&A site for professional and enthusiast programmers. ' +
		'It is built and run by you as part of the Stack Exchange network of Q&A sites. ' +
		'With your help, we are working together to build a library of detailed answers to every question about programming.',
	icons:{
		icon: '/assets/images/site-logo.svg',
	}
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider appearance={{
			elements:{
				formButtonPrimary:'primary-gradient',
				footerActionLink:'primary-text-gradient hover:text-primary-500',
			}

		}}>
			<html lang="en">
				<body className={`${inter.variable} ${spaceGrotesk.variable}`}>
			 <h1 className="h1-bold">this is a  piece of text</h1>

				{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
