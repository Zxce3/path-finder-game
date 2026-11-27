// localStorage can throw (private mode, blocked site data).
export function load(key: string) {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function save(key: string, value: string) {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Not persisted; keep playing.
	}
}
