const retdata = {
    labels:['01.10.2021', '02.10.2021'],
    buyers:['02.10.2021', '02.10.2021'],
    another:[
        {date:'02.10.2021', sum:10},
        {date:'02.10.2021', sum:20}
    ]
}
window.addEventListener("load", function() {
    const config = {
        type: 'line',
        data: {},
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
            },
            hover: {
                mode: 'index',
                intersec: false
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        stepSize: 50
                    }
                }
            }
        },
    };
    const chart = new Chart(document.getElementById('stats'), config);
    Update(retdata);
    function Update(data) {
        const _data = {
            labels: data.labels,
            datasets: [
                {
                    label: 'Продано',
                    backgroundColor: '#00ff19',
                    borderColor: '#00ff19',
                    data: RenderData(data.buyers, data.labels),
                },
                {
                    label: 'Средняя стоимость',
                    backgroundColor: '#0089c7',
                    borderColor: '#0089c7',
                    data: RenderSumData(data.another, data.labels),
                }
            ]
        };
        chart.config.data = _data;
        chart.update();
        function RenderData(data, labels) {
            const ret = [];
            for (let i = 0; i < labels.length; i++) {
                const el = labels[i];
                ret.push(data.filter(x => x == el).length);
            }
            return ret;
        }
        function RenderSumData(data, labels) {
            const ret = [];
            for (let i = 0; i < labels.length; i++) {
                const el = labels[i];
                let sum = 0;
                let total = 0;
                const __d = data.filter(x => x.date == el);
                if(__d == null || __d == undefined) continue;
                for (let i = 0; i < __d.length; i++) {
                    const __e = __d[i];
                    total++;
                    sum+=__e.sum;
                }
                if(sum == 0) ret.push(0);
                else ret.push(sum/total);
            }
            return ret;
        }
    }
});