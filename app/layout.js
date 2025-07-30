import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata = {
	title: "PaySync",
	description:
		"PaySync is a smart expense management app that helps you split bills, track expenses, and settle payments effortlessly. Simplify group finances with ease.",
};

export default function RootLayout({ children }) {
  return (
		<html lang="en">
			<head>
				<link rel="icon" href="/logos/logo-s-2.png" sizes="any" />
			</head>
			<body className={`${inter.className}`}>
        <ConvexClientProvider>
					<main className="min-h-screen">{children}</main>
				</ConvexClientProvider>
			</body>
		</html>
  );
}
