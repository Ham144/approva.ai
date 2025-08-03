import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApp, loginLdap } from "@/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useUserInfo } from "@/store";
import { APP_NAME, siteKeyCloudflare } from "@/api/constant";
import { LogIn, Search } from "lucide-react";
import OrgApi from "@/api/orgApi";
import TurnstileCaptcha from "@/components/TurnstileCaptcha";

export default function Login({ className, ...props }) {
	const [username, setUsername] = useState(``);
	const [password, setPassword] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [selectedOrg, setSelectedOrg] = useState("");
	const [search, setSearch] = useState("");
	const [authMethod, setAuthMethod] = useState("ldap");
	const [captchaToken, setCaptchaToken] = useState("");

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: searchResult } = useQuery({
		queryKey: ["orgs", search],
		queryFn: async () => {
			const res = await OrgApi.getAllOrg(search); // search dikirim
			return res.data; // ini adalah array langsung
		},
		enabled: !!search,
	});

	// Zustand
	const { setUserInfo } = useUserInfo();

	const { mutateAsync: handleLoginLdap, isPending } = useMutation({
		mutationFn: async () => {
			const res = await loginLdap({
				username,
				password,
				selectedOrg,
				captchaToken,
			});
			return res.data;
		},
		retryDelay: 1000,
		mutationKey: ["userInfo"],
		onSuccess: async (res) => {
			setUserInfo(res?.data);
			//Invalidate query untuk memperbarui data
			queryClient.invalidateQueries(["userInfo"]);

			toast.success("Login berhasil!");
			navigate("/");
			setTimeout(() => {
				navigate("/"); //emang sengaja ada 2 navigate karena sering gagal
			}, 1000);
		},
		onError: (err) => {
			console.log(err);
			toast.error(
				err?.response?.data?.message ||
					"Login gagal. Periksa username dan password Anda."
			);
		},
	});

	const { mutateAsync: handleLoginApp, isPending: loadingAppLogin } =
		useMutation({
			mutationFn: async () => {
				const res = await loginApp({
					username,
					password,
					selectedOrg,
					captchaToken,
				});
				return res.data;
			},
			retryDelay: 1000,
			mutationKey: ["userInfo"],
			onSuccess: async (res) => {
				setUserInfo(res?.data);

				//Invalidate query untuk memperbarui data
				queryClient.invalidateQueries(["userInfo"]);

				toast.success("Login berhasil!");
				navigate("/");
				setTimeout(() => {
					navigate("/"); //emang sengaja ada 2 navigate karena sering gagal
				}, 1000);
			},
			onError: (err) => {
				toast.error(
					err?.response?.data?.message ||
						"Login gagal. Periksa username dan password Anda."
				);
			},
		});

	function loginGate() {
		if (!captchaToken) {
			toast.error("Harap selesaikan CAPTCHA terlebih dahulu.");
			return;
		}
		if (authMethod === "app") {
			handleLoginApp();
		} else {
			handleLoginLdap();
		}
	}

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto max-md:py-20"
			{...props}
		>
			<div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
				<div className="grid grid-cols-1 md:grid-cols-2">
					{/* Form Section */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							loginGate();
						}}
						className="p-8 md:p-12 space-y-6"
					>
						<div className="flex flex-col items-center text-center mb-6">
							<h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
								{APP_NAME}
							</h1>
							<p className="text-balance text-lg text-gray-700 dark:text-gray-300">
								Selamat datang! Silakan masuk untuk melanjutkan.
							</p>
							<p className="mt-3 px-4 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full font-medium">
								Gunakan Kredensial LDAP CSI Anda atau username:password yang
								diberikan IT
							</p>
						</div>

						<div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6">
							{/* Authentication Method Selection */}
							<div className="grid grid-cols-2 gap-3">
								<button
									onClick={() => {
										if (import.meta.env.VITE_DEMO) {
											setAuthMethod("app");
											setUsername("admin");
											setPassword("admin");
											setSearch("*");
										} else {
											setAuthMethod("app");
										}
									}}
									type="button"
									className={`btn rounded-lg px-4 py-2 transition-all duration-200 ${
										authMethod === "app"
											? "bg-blue-600 text-white shadow-lg transform -translate-y-0.5"
											: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
									}`}
								>
									App Authentication
								</button>
								<button
									onClick={() => setAuthMethod("ldap")}
									type="button"
									className={`btn rounded-lg px-4 py-2 transition-all duration-200 ${
										authMethod === "ldap"
											? "bg-blue-600 text-white shadow-lg transform -translate-y-0.5"
											: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
									}`}
								>
									LDAP Authentication
								</button>
							</div>

							{/* Username Input */}
							<div className="space-y-2">
								<label
									htmlFor="username"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Username
								</label>
								<input
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									type="text"
									placeholder="Enter your username"
									required
									className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
									disabled={isPending || isVerifying}
								/>
							</div>

							{/* Password Input */}
							<div className="space-y-2">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Password
								</label>
								<input
									id="password"
									type="password"
									value={password}
									placeholder="Enter your password"
									onChange={(e) => setPassword(e.target.value)}
									required
									className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
									disabled={isPending || isVerifying || loadingAppLogin}
								/>
							</div>

							{/* Organization Search */}
							<div className="space-y-3">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Search Organization
								</label>
								<div className="relative">
									<input
										type="text"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm pr-10"
										placeholder="Example: PT Inovasi Teknologi"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
										<Search className="text-gray-400" />
									</div>
								</div>

								{/* Search Results */}
								{searchResult?.length > 0 ? (
									<ul className="border border-gray-200 dark:border-gray-700 rounded-lg mt-2 overflow-y-auto max-h-40 divide-y divide-gray-200 dark:divide-gray-700 shadow-inner">
										{searchResult.map((org) => (
											<li
												key={org._id}
												onClick={() => {
													setSelectedOrg(org);
													setSearch(org.organizationName);
												}}
												className={`p-3 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer transition-all duration-150 ${
													selectedOrg?._id === org._id
														? "bg-blue-50 dark:bg-blue-800"
														: ""
												}`}
											>
												<div className="text-sm font-medium text-gray-800 dark:text-gray-200">
													{org.organizationName}
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">
													ID: {org._id}
												</div>
											</li>
										))}
									</ul>
								) : (
									search && (
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
											Organization not found. Try another name or register a new
											one.
										</p>
									)
								)}
							</div>
						</div>

						<div className="w-full justify-center flex">
							<TurnstileCaptcha
								siteKey={siteKeyCloudflare} // atau bisa hardcode dulu
								onVerify={(token) => setCaptchaToken(token)}
							/>
						</div>

						<button
							type="submit"
							className={`
                  w-full py-3 px-4 rounded-lg text-white font-bold text-lg
                  bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                  shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2
                  ${
										isPending || isVerifying || loadingAppLogin
											? "opacity-70 cursor-not-allowed"
											: ""
									}
                `}
							disabled={isPending || isVerifying || loadingAppLogin}
						>
							{isPending || isVerifying || loadingAppLogin ? (
								<>
									<span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
									{isVerifying ? "Memverifikasi..." : "Memproses..."}
								</>
							) : (
								<>
									<LogIn className="w-5 h-5" /> Login
								</>
							)}
						</button>

						{/* <div className="text-right">
              <a
                href="/register"
                className="text-sm text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline transition-colors duration-200"
              >
                Registrasi (Validasi Akun baru)
              </a>
            </div> */}
					</form>

					{/* Image Section */}
					<div className="relative hidden md:flex items-center justify-center bg-blue-50 dark:bg-gray-900 p-6">
						{!(isPending || isVerifying) ? (
							<img
								src="/csi-logo.png" // Pastikan path ini benar
								alt="CSI Logo"
								className="max-w-[80%] max-h-[80%] object-contain" // Lebih responsif dan terpusat
							/>
						) : (
							<span className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
