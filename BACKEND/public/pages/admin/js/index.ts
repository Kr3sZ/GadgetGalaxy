interface ApiResponse {
	error: boolean
	message: any
}

function post(url: string, pBody: any): Promise<ApiResponse> {
	return new Promise((resolve: (value: ApiResponse) => void, reject: (reason?: any) => void): void => {
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(pBody)
		}).then((res: Response): any => {
			if (!res.ok) {
				reject(`error: invalid status: ${res.status}`)
			}

			return res.json()
		}).then((data: ApiResponse): void => {
			resolve(data)
		}).catch((e: any): void => {
			reject(e)
		})
	})
}

function get(url: string): Promise<ApiResponse> {
	return new Promise((resolve: (value: ApiResponse) => void, reject: (reason?: any) => void): void => {
		fetch(url).then((res: Response): any => {
			if (!res.ok) {
				reject(`error: invalid status: ${res.status}`)
			}

			return res.json()
		}).then((data: ApiResponse): void => {
			resolve(data)
		}).catch((e: any): void => {
			reject(e)
		})
	})
}
