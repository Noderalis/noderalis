import { CharCode } from './charCode';

export interface UriComponents {
	scheme: string;
	authority: string;
	path: string;
	query: string;
	fragment: string;
}

/**
 * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component parts
 * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 * ```txt
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 * ```
 *
 * For a simplified example, refer to the Wikipedia article
 * [here](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Generic_syntax).
 */
export class URI implements UriComponents {
	private static readonly encodeTable: { [charCode: number]: string } = {
		[CharCode.Colon]: '%3A', // gen-delims
		[CharCode.Slash]: '%2F',
		[CharCode.QuestionMark]: '%3F',
		[CharCode.Hash]: '%23',
		[CharCode.OpenSquareBracket]: '%5B',
		[CharCode.CloseSquareBracket]: '%5D',
		[CharCode.AtSign]: '%40',

		[CharCode.ExclamationMark]: '%21', // sub-delims
		[CharCode.DollarSign]: '%24',
		[CharCode.Ampersand]: '%26',
		[CharCode.SingleQuote]: '%27',
		[CharCode.OpenParen]: '%28',
		[CharCode.CloseParen]: '%29',
		[CharCode.Asterisk]: '%2A',
		[CharCode.Plus]: '%2B',
		[CharCode.Comma]: '%2C',
		[CharCode.Semicolon]: '%3B',
		[CharCode.Equals]: '%3D',

		[CharCode.Space]: '%20',
	};
	/**
	 * `scheme` is the '`foo`://example.com:8042/over/there?name=ferret#nose'
	 * section of a URI.
	 */
	readonly scheme: string;

	/**
	 * `authority` is the 'foo://`example.com:8042`/over/there?name=ferret#nose'
	 * section of a URI.
	 */
	readonly authority: string;

	/**
	 * `path` is the 'foo://example.com:8042/`over/there`?name=ferret#nose'
	 * section of a URI.
	 */
	readonly path: string;

	/**
	 * `query` is the 'foo://example.com:8042/over/there?`name=ferret`#nose'
	 * section of a URI.
	 */
	readonly query: string;

	/**
	 * `fragment` is the 'foo://example.com:8042/over/there?name=ferret#`nose`'
	 * section of a URI.
	 */
	readonly fragment: string;

	constructor(uri: UriComponents) {
		const { scheme, authority, path, query, fragment } = uri;
		this.scheme = scheme;
		this.authority = authority;
		this.path = path;
		this.query = query;
		this.fragment = fragment;
	}

	/**
	 * Creates a string representation of the current URI.
	 *
	 * * The result shall *not* be used for display purposes but for externalization or transport.
	 * * The result will be encoded using the percentage encoding and encoding happens mostly
	 * ignore the scheme-specific encoding rules.
	 *
	 * @param skipEncoding Do not encode the result.
	 */
	public toString(skipEncoding: boolean = false) {
		return URI.externalizeUri(this, skipEncoding);
	}

	/**
	 * Returns the URI as-is.
	 */
	public toJSON(): UriComponents {
		return this;
	}

	/**
	 * Creates a new URI from a given string.
	 *
	 * @param uriString A string to create the URI from, e.g. `https://example.com:4200/home?title=hello#about`
	 */
	public static parse(uriString: string): URI {
		const match = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.exec(
			uriString
		);

		if (!match) {
			return new Uri({
				scheme: '',
				authority: '',
				path: '',
				query: '',
				fragment: '',
			});
		}

		return new Uri({
			scheme: match[2] || '',
			authority: match[4] || '',
			path: match[5] || '',
			query: match[7] || '',
			fragment: match[9] || '',
		});
	}

	/**
	 * Creates a new URI from a file system path, e.g. `c:\my\files`,
	 * `/usr/home`, or `\\server\share\some\path`.
	 *
	 * @param path A file system path (see `URI#fsPath`).
	 */
	public static file(path: string): URI {
		let authority = '';

		if (process.platform == 'win32') {
			path = path.replace(/\\/g, '/');
		}

		if (path[0] === '/' && path[1] === '/') {
			const idx = path.indexOf('/', 2);

			if (idx === -1) {
				authority = path.substring(2);
				path = '/';
			} else {
				authority = path.substring(2, idx);
				path = path.substring(idx) || '/';
			}
		}

		return new Uri({
			scheme: 'file',
			authority,
			path,
			query: '',
			fragment: '',
		});
	}

	/**
	 * Returns a string representing the corresponding file system path of this URI.
	 * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
	 * platform specific path separator.
	 *
	 * For use with URIs that represent files on disk (`file` scheme).
	 */
	public get fsPath(): string {
		return URI.uriToFsPath(this, false);
	}

	/**
	 * Compute `fsPath` for the given URI.
	 *
	 * @param uri the URI to convert into an `fsPath`.
	 * @param keepDriveLetterCasing should we keep the casing for the drive?
	 */
	public static uriToFsPath(uri: URI, keepDriveLetterCasing: boolean): string {
		let value: string;

		if (uri.authority && uri.path.length > 1 && uri.scheme === 'file') {
			value = `//${uri.authority}${uri.path}`;
		} else if (
			uri.path.charCodeAt(0) === CharCode.Slash &&
			uri.path.charCodeAt(1) >= CharCode.A &&
			uri.path.charCodeAt(1) <= CharCode.Z &&
			uri.path.charCodeAt(1) >= CharCode.a &&
			uri.path.charCodeAt(1) <= CharCode.z &&
			uri.path.charCodeAt(2) === CharCode.Colon
		) {
			if (!keepDriveLetterCasing)
				value = `${uri.path[1].toLocaleLowerCase()}${uri.path.substr(2)}`;
			else value = uri.path.substr(1);
		} else {
			value = uri.path;
		}

		if (process.platform === 'win32') value = value.replace(/\//g, '\\');

		return value;
	}

	/**
	 * Externalizes a given URI into a string for use in transport.
	 *
	 * @param uri A URI instance to externalize.
	 * @param skipEncoding Should we encode the URI string?
	 */
	public static externalizeUri(uri: URI, skipEncoding: boolean): string {
		const encoder = !skipEncoding
			? URI.encodeUriComponentFast
			: URI.encodeUriComponentMinimal;
		let res = '';
		let { scheme, authority, path, query, fragment } = uri;

		if (scheme) {
			res += scheme;
			res += ':';
		}

		if (authority || scheme === 'file') {
			res += '/';
			res += '/';
		}

		if (authority) {
			let idx = authority.indexOf('@');

			if (idx !== -1) {
				// <user>@<auth>
				const userinfo = authority.substr(0, idx);
				authority = authority.substr(idx + 1);
				idx = userinfo.indexOf(':');

				if (idx === -1) {
					res += encoder(userinfo, false);
				} else {
					// <user>:<pass>@<auth>
					res += encoder(userinfo.substr(0, idx), false);
					res += ':';
					res += encoder(userinfo.substr(idx + 1), false);
				}

				res += '@';
			}

			authority = authority.toLowerCase();
			idx = authority.indexOf(':');

			if (idx === -1) {
				res += encoder(authority, false);
			} else {
				// <auth>:<port>
				res += encoder(authority.substr(0, idx), false);
				res += authority.substr(idx);
			}
		}

		if (path) {
			// lower-case windows drive letters in /C:/fff or C:/fff
			if (
				path.length >= 3 &&
				path.charCodeAt(0) === CharCode.Slash &&
				path.charCodeAt(2) === CharCode.Colon
			) {
				const code = path.charCodeAt(1);

				if (code >= CharCode.A && code <= CharCode.Z) {
					path = `/${String.fromCharCode(code + 32)}:${path.substr(3)}`; // "/c:".length === 3
				}
			} else if (path.length >= 2 && path.charCodeAt(1) === CharCode.Colon) {
				const code = path.charCodeAt(0);

				if (code >= CharCode.A && code <= CharCode.Z) {
					path = `${String.fromCharCode(code + 32)}:${path.substr(2)}`; // "/c:".length === 3
				}
			}

			// encode the rest of the path
			res += encoder(path, true);
		}

		if (query) {
			res += '?';
			res += encoder(query, false);
		}

		if (fragment) {
			res += '#';
			res += !skipEncoding
				? URI.encodeUriComponentFast(fragment, false)
				: fragment;
		}

		return res;
	}

	private static encodeUriComponentFast(
		uriComponent: string,
		allowSlash: boolean
	): string {
		let res: string | undefined = undefined;
		let nativeEncodePos = -1;

		for (let pos = 0; pos < uriComponent.length; pos++) {
			const code = uriComponent.charCodeAt(pos);

			// unreserved characters: https://tools.ietf.org/html/rfc3986#section-2.3
			if (
				(code >= CharCode.a && code <= CharCode.z) ||
				(code >= CharCode.A && code <= CharCode.Z) ||
				(code >= CharCode.Digit0 && code <= CharCode.Digit9) ||
				code === CharCode.Dash ||
				code === CharCode.Period ||
				code === CharCode.Underline ||
				code === CharCode.Tilde ||
				(allowSlash && code === CharCode.Slash)
			) {
				// check if we are delaying native encode
				if (nativeEncodePos !== -1) {
					res += encodeURIComponent(
						uriComponent.substring(nativeEncodePos, pos)
					);
					nativeEncodePos = -1;
				}
				// check if we write into a new string (by default we try to return the param)
				if (res !== undefined) {
					res += uriComponent.charAt(pos);
				}
			} else {
				// encoding needed, we need to allocate a new string
				if (res === undefined) {
					res = uriComponent.substr(0, pos);
				}

				// check with default table first
				const escaped = this.encodeTable[code];

				if (escaped !== undefined) {
					// check if we are delaying native encode
					if (nativeEncodePos !== -1) {
						res += encodeURIComponent(
							uriComponent.substring(nativeEncodePos, pos)
						);
						nativeEncodePos = -1;
					}

					// append escaped variant to result
					res += escaped;
				} else if (nativeEncodePos === -1) {
					// use native encode only when needed
					nativeEncodePos = pos;
				}
			}
		}

		if (nativeEncodePos !== -1) {
			res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
		}

		return res !== undefined ? res : uriComponent;
	}

	private static encodeUriComponentMinimal(path: string): string {
		let res: string | undefined = undefined;
		for (let pos = 0; pos < path.length; pos++) {
			const code = path.charCodeAt(pos);
			if (code === CharCode.Hash || code === CharCode.QuestionMark) {
				if (res === undefined) {
					res = path.substr(0, pos);
				}
				res += this.encodeTable[code];
			} else {
				if (res !== undefined) {
					res += path[pos];
				}
			}
		}
		return res !== undefined ? res : path;
	}
}

export class Uri extends URI {}

const UrlTest = URI.parse('file://server/c$/folder/file.txt');

console.log(UrlTest);
