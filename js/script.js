const COMPARISON_YEAR = 2018;
const FEMALE_KEY = 'average_value_School enrollment, tertiary, female (% gross)';
const MALE_KEY = 'average_value_School enrollment, tertiary, male (% gross)';

const WHITE_HAT_COUNTRIES = [
    'Puerto Rico',
    'Qatar',
    'Iceland',
    'Kuwait',
    'Latvia',
    'Sweden',
    'Australia',
    'Norway',
    'New Zealand',
    'Bahrain',
    'Oman',
    'Estonia',
    'Low income',
    'Senegal',
    'Bangladesh',
    'Iran, Islamic Rep.',
    'Benin',
    'Afghanistan',
    'Togo',
    'Turkey',
    'San Marino',
    "Korea, Dem. People's Rep.",
    'Korea, Rep.',
    'Liechtenstein'
];

const BLACK_HAT_COUNTRIES = [
    'Liechtenstein',
    'Korea, Rep.',
    'San Marino',
    'Turkey',
    'Iran, Islamic Rep.',
    'Morocco'
];

function getPaired2018Data(data) {
    return data
        .filter(d => d.Year === String(COMPARISON_YEAR))
        .map(d => {
            const female = d[FEMALE_KEY] === '' ? Number.NaN : +d[FEMALE_KEY];
            const male = d[MALE_KEY] === '' ? Number.NaN : +d[MALE_KEY];
            return {
                country: d['Country Name'],
                year: COMPARISON_YEAR,
                female,
                male,
                gap: male - female
            };
        })
        .filter(d => d.country && Number.isFinite(d.female) && Number.isFinite(d.male));
}

function drawGroupedChart(containerId, records, options) {
    const width = options.width;
    const height = options.height;
    const margin = { top: 70, right: 30, bottom: 145, left: 70 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select(containerId).selectAll('*').remove();

    const svg = d3.select(containerId)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('role', 'img')
        .attr('aria-label', options.ariaLabel);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('class', 'chart-title')
        .text(options.title);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('class', 'chart-subtitle')
        .text(`${COMPARISON_YEAR} gross tertiary enrollment (%) — ${options.subtitle}`);

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
        .domain(records.map(d => d.country))
        .range([0, chartWidth])
        .paddingInner(0.18);

    const x1 = d3.scaleBand()
        .domain(['female', 'male'])
        .range([0, x0.bandwidth()])
        .padding(0.10);

    let yMin = 0;
    if (options.truncated) {
        yMin = options.yMin;
    }

    const yMax = d3.max(records, d => Math.max(d.female, d.male));
    const y = d3.scaleLinear()
        .domain([yMin, yMax * 1.08])
        .range([chartHeight, 0]);

    chart.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x0))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end')
        .attr('dx', '-0.35em')
        .attr('dy', '0.35em');

    if (options.truncated) {
        chart.append('g')
            .call(d3.axisLeft(y).tickValues(d3.range(yMin, yMax * 1.08, 15)));
    } else {
        chart.append('g')
            .call(d3.axisLeft(y).ticks(8));
    }

    chart.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', chartHeight + 125)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-label')
        .text('Country');

    chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -chartHeight / 2)
        .attr('y', -52)
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-label')
        .text('Gross tertiary enrollment (%)');

    const tooltip = d3.select('#tooltip')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('opacity', 0);

    const groups = chart.selectAll('.country-group')
        .data(records)
        .join('g')
        .attr('class', 'country-group')
        .attr('transform', d => `translate(${x0(d.country)},0)`);

    groups.selectAll('rect')
        .data(d => [
            { gender: 'Female', value: d.female, country: d.country, year: d.year },
            { gender: 'Male', value: d.male, country: d.country, year: d.year }
        ])
        .join('rect')
        .attr('x', d => x1(d.gender.toLowerCase()))
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => chartHeight - y(d.value))
        .attr('fill', d => d.gender === 'Female' ? '#ff1493' : '#2878b5')
        .on('mouseenter', (event, d) => {
            tooltip
                .html(`<strong>${d.country}</strong><br>${d.gender} enrollment: ${d.value.toFixed(2)}%<br>Year: ${d.year}`)
                .style('opacity', 1);
        })
        .on('mousemove', event => {
            tooltip
                .style('left', `${event.pageX + 12}px`)
                .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0));

    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 190},${margin.top - 50})`);

    legend.append('rect').attr('width', 13).attr('height', 13).attr('fill', '#ff1493');
    legend.append('text').attr('x', 18).attr('y', 11).text('Female');
    legend.append('rect').attr('x', 82).attr('width', 13).attr('height', 13).attr('fill', '#2878b5');
    legend.append('text').attr('x', 100).attr('y', 11).text('Male');

    if (options.truncated) {
        svg.append('text')
            .attr('x', margin.left)
            .attr('y', height - 12)
            .attr('class', 'axis-break-note')
    }
}

function init() {
    d3.csv('data/gender.csv', d => d).then(data => {
        const paired = getPaired2018Data(data);

        const whiteData = WHITE_HAT_COUNTRIES
            .map(countryName => paired.find(d => d.country === countryName))
            .filter(d => d !== undefined);


        drawGroupedChart('#vis', whiteData, {
            width: 1100,
            height: 560,
            title: 'Tertiary Enrollment by Gender',
            ariaLabel: 'White hat grouped bar chart comparing female and male tertiary enrollment in 2018',
            truncated: false
        });

        const blackData = BLACK_HAT_COUNTRIES
            .map(countryName => paired.find(d => d.country === countryName))
            .filter(d => d !== undefined);


        drawGroupedChart('#vis2', blackData, {
            width: 1100,
            height: 560,
            title: 'Persistent Male Advantage in Tertiary Enrollment',
            subtitle: 'Intentionally misleading presentation',
            ariaLabel: 'Black hat misleading grouped bar chart comparing male-favoring countries in 2018',
            truncated: true,
            yMin: 25
        });

        document.querySelector('#year-count').textContent =
            `2018 had ${paired.length} countries or country aggregates with paired, non-missing tertiary enrollment values.`;
    });
}

window.addEventListener('load', init);
