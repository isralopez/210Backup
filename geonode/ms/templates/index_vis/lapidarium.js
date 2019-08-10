<script type="text/javascript">
d3.json("{% url 'ms_nar_json' config.id %}", function(error, data) {

let cat = {{cat}};

/*eslint-enable indent*/
/*global d3*/
let svg = d3.select('#teck-stack-svg');
let width = svg.property('clientWidth'); // get width in pixels
let height = +svg.attr('height');
let centerX = width * 0.5;
let centerY = height * 0.5;
let strength = 0.05;
let focusedNode;
var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

let format = d3.format(',d');

let scaleColor = d3.scaleOrdinal(d3.schemeCategory10);


// use pack to calculate radius of the circle
let pack = d3.pack()
	.size([width, height ])
	.padding(1.5);

let forceCollide = d3.forceCollide(d => d.r + 1);

// use the force
let simulation = d3.forceSimulation()
	.force('charge', d3.forceManyBody())
	.force('collide', forceCollide)
	.force('x', d3.forceX(centerX ).strength(strength))
	.force('y', d3.forceY(centerY ).strength(strength));

// reduce number of circles on mobile screen due to slow computation
if ('matchMedia' in window && window.matchMedia('(max-device-width: 767px)').matches) {
	data = data.filter(el => {
		return el.value >= 50;
	});
}

let root = d3.hierarchy({ children: data })
	.sum(d => d.value);

// we use pack() to automatically calculate radius conveniently only
// and get only the leaves
let nodes = pack(root).leaves().map(node => {
	// console.log('node:', node.x, (node.x - centerX) * 2);
	const data = node.data;
	return {
		x: centerX + (node.x - centerX) * 3, // magnify start position to have transition to center movement
		y: centerY + (node.y - centerY) * 3,
		r: 0, // for tweening
		radius: node.r, //original radius
		id: data.cat + '.' + (data.name.replace(/\s/g, '-')),
		cat: data.cat,
		name: data.name,
		value: data.value,
		icon: data.icon,
		desc: data.des,
		link: data.link,
	};
});
simulation.nodes(nodes).on('tick', ticked);

let node = svg.selectAll('.node')
	.data(nodes)
	.enter().append('g')
	.attr('class', 'node')
	.call(d3.drag()
		.on('start', (d) => {
			if (!d3.event.active) { simulation.alphaTarget(0.2).restart(); }
			d.fx = d.x;
			d.fy = d.y;
		})
		.on('drag', (d) => {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		})
		.on('end', (d) => {
			if (!d3.event.active) { simulation.alphaTarget(0); }
			d.fx = null;
			d.fy = null;
		}));

node.append('circle')
	.attr('id', d => d.id)
	.attr('r', 0)
	.style('opacity', 0.8)
	.style('fill', d => (cat === 0) ? scaleColor(d.id) : scaleColor(d.cat) )
	.transition().duration(2000).ease(d3.easeElasticOut)
		.tween('circleIn', (d) => {
			let i = d3.interpolateNumber(0, d.radius);
			return (t) => {
				d.r = i(t);
				simulation.force('collide', forceCollide);
			};
		});

node.append('clipPath')
	.attr('id', d => `clip-${d.id}`)
	.append('use')
	.attr('xlink:href', d => `#${d.id}`);

// display text as circle icon
node.filter(d => !String(d.icon).includes('ms/'))
	.append('text')
	.classed('node-icon', true)
	.attr('clip-path', d => `url(#clip-${d.id})`)
	.selectAll('tspan')
	.data(d => d.icon.split(';'))
	.enter()
		.append('tspan')
		.attr('x', 0)
		.attr('y', (d, i, nodes) => (13 + (i - nodes.length / 2 - 0.5) * 10))
		.text(name => name);

// display image as circle icon
node.filter(d => String(d.icon).includes('ms/'))
	.append('image')
	.classed('node-icon', true)
	.attr('clip-path', d => `url(#clip-${d.id})`)
	.attr('xlink:href', d => d.icon)
	.attr('x', d => -d.radius * 0.7)
	.attr('y', d => -d.radius * 0.7)
	.attr('height', d => d.radius * 2 * 0.7)
	.attr('width', d => d.radius * 2 * 0.7);

node.append('title')
	.text(d => ( d.name));

let infoBox = node.append('foreignObject')
	.classed('circle-overlay hidden', true)
	.attr('x', -350 * 0.5 * 0.8)
	.attr('y', -350 * 0.5 * 0.8)
	.attr('height', 350 * 0.8)
	.attr('width', 350 * 0.8)
		.append('xhtml:div')
		.classed('circle-overlay__inner', true);

infoBox.append('h2')
	.classed('circle-overlay__title', true)
	.text(d => d.name);

infoBox.append('p')
	.classed('circle-overlay__body', true)
	.html(d => d.desc + '<br><br><br> <a href="#">Ir a la información</a>');


node.on('click', (currentNode) => {
	d3.event.stopPropagation();
	console.log('currentNode', currentNode);
	let currentTarget = d3.event.currentTarget; // the <g> el

	if (currentNode === focusedNode) {
		console.log(currentNode.link);
		!regexp.test(currentNode.link) ? window.open(currentNode.link,"_self") : window.open(currentNode.link);
		return;
	}
	let lastNode = focusedNode;
	focusedNode = currentNode;

	simulation.alphaTarget(0.2).restart();
	// hide all circle-overlay
	d3.selectAll('.circle-overlay').classed('hidden', true);
	d3.selectAll('.node-icon').classed('node-icon--faded', false);

	// don't fix last node to center anymore
	if (lastNode) {
		lastNode.fx = null;
		lastNode.fy = null;
		node.filter((d, i) => i === lastNode.index)
			.transition().duration(2000).ease(d3.easePolyOut)
			.tween('circleOut', () => {
				let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
				return (t) => {
					lastNode.r = irl(t);
				};
			})
			.on('interrupt', () => {
				lastNode.r = lastNode.radius;
			});
	}


	d3.transition().duration(2000).ease(d3.easePolyOut)
		.tween('moveIn', () => {
			console.log('tweenMoveIn', currentNode);
			let ix = d3.interpolateNumber(currentNode.x, centerX);
			let iy = d3.interpolateNumber(currentNode.y, centerY);
			let ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
			return function (t) {
				currentNode.fx = ix(t);
				currentNode.fy = iy(t);
				currentNode.r = ir(t);
				simulation.force('collide', forceCollide);
			};
		})
		.on('end', () => {
			simulation.alphaTarget(0);
			let $currentGroup = d3.select(currentTarget);
			$currentGroup.select('.circle-overlay')
				.classed('hidden', false);
			$currentGroup.select('.node-icon')
				.classed('node-icon--faded', true);

		})
		.on('interrupt', () => {
			console.log('move interrupt', currentNode);
			currentNode.fx = null;
			currentNode.fy = null;
			simulation.alphaTarget(0);
		});

});

// blur
d3.select(document).on('click', () => {
	let target = d3.event.target;
	// check if click on document but not on the circle overlay
	if (!target.closest('#circle-overlay') && focusedNode) {
		focusedNode.fx = null;
		focusedNode.fy = null;
		simulation.alphaTarget(0.2).restart();
		d3.transition().duration(2000).ease(d3.easePolyOut)
			.tween('moveOut', function () {
				console.log('tweenMoveOut', focusedNode);
				let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
				return function (t) {
					focusedNode.r = ir(t);
					simulation.force('collide', forceCollide);
				};
			})
			.on('end', () => {
				focusedNode = null;
				simulation.alphaTarget(0);
			})
			.on('interrupt', () => {
				simulation.alphaTarget(0);
			});

		// hide all circle-overlay
		d3.selectAll('.circle-overlay').classed('hidden', true);
		d3.selectAll('.node-icon').classed('node-icon--faded', false);
	}
});

function ticked() {
	node
		.attr('transform', d => `translate(${d.x},${d.y})`)
		.select('circle')
			.attr('r', d => d.r);
}

});
</script>