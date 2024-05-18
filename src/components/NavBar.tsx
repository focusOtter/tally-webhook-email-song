function NavBar() {
	return (
		<div className="navbar bg-primary">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">Focus Otter Tally</a>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li>
						<a
							className="link"
							href="https://github.com/focusOtter/tally-webhook-email-song"
							target="_blank"
							rel="noopener noreferrer"
						>
							Repo
						</a>
					</li>
					<li>
						<details>
							<summary>Content</summary>
							<ul className="p-2 bg-base-100 rounded-t-none">
								<li>
									<a>Blog (TBD)</a>
								</li>
								<li>
									<a>Video (TBD)</a>
								</li>
							</ul>
						</details>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default NavBar
