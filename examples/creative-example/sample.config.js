// -------------------------------------------------------------
// This file is only for testing purposes
// do not include it on your real creative and do not
// use an OpenLoopConfig file like this for dev environment as
// the structure of the real published config may change.
// Use default setters instead.
// -------------------------------------------------------------
openLoopConfig({
	"?xml": {
		"@version": "1.0",
		"@encoding": "utf-8"
	},
	"openLoopConfig": {
		"@timestamp": "1520015719",
		"config": {
			"@timestamp": "1520015719",
			"showDefault": "false"
		},
		"twitter": null,
		"images": {
			"data": [
				{
					"@id": "cloudy",
					"@timestamp": "1520015719",
					"item": [
						{
							"@id": "178",
							"image_src": "1207_178_1158_96_4 - cloudy.jpg"
						},
						{
							"@id": "179",
							"image_src": "1207_179_1158_97_5 - cloudy.mp4"
						}
					]
				},
				{
					"@id": "sunny",
					"@timestamp": "1520015719",
					"item": [
						{
							"@id": "175",
							"image_src": "1206_175_1158_93_1 - sunny.jpg"
						},
						{
							"@id": "176",
							"image_src": "1206_176_1158_94_2 - sunny.mp4"
						}
					]
				}
			]
		},
		"free_text": {
			"data": [
				{
					"@id": "cloudy",
					"@timestamp": "1520015719",
					"item": [
						{
							"@id": "0",
							"body": "Too many clouds today!"
						}
					]
				},
				{
					"@id": "sunny",
					"@timestamp": "1520015719",
					"item": [
						{
							"@id": "0",
							"body": "You should wear sunglasses today"
						}
					]
				}
			]
		},
		"rss": null,
		"xml": null,
		"json": {
			"data": {
				"@id": "weather",
				"@timestamp": "1518816947",
				"data": {
					"panels": [
						{
							"id": 123,
							"status": "sunny"
						},
						{
							"id": 456,
							"status": "cloudy"
						},
						{
							"id": 789,
							"status": "cloudy"
						}
					]
				}
			}
		}
	}
});
