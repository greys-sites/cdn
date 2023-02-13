module.exports = (data) => (
	`<div class='card'>`  +
		`<div class='wrapper' style="background-image: url('/${data.hid}.${data.mime}')">` +
			`<div class='info'>` +
				`<h2>${data.name}</h2>` +
				`<div class='btns'>` +
					`<a href='/${data.hid}.${data.mime}'>View</a>` +
					`<a href='/edit/${data.hid}'>Edit</a>` +
				`</div>` +
			`</div>` +
		`</div>` +
	`</div>`
)