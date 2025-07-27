$(document).ready(function () {
    document.querySelectorAll(".click_me").forEach((element) => element.click());
});
function system_load(data, id) {
    var charts = [];
    var toolTip = {
        shared: true
    },
    legend = {
        cursor: "pointer",
        itemclick: function (e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    };

    let data_ = JSON.parse(data);

    let cpu_data = [];
    {
        let _cpus = 0;
        for (let i = 0; i < data_.length; i++) {
            if(data_[i].cpus.length > _cpus) _cpus = data_[i].cpus.length;
        }
        for (let n = 0; n < _cpus; n++) {
            let color = "#64b5f6";
            if (n == 1) color = "#58aff5";
            else if (n == 2) color = "#4ea9f2";
            else if (n == 3) color = "#47a3ed";
            else if (n == 4) color = "#41a2f0";
            else if (n == 5) color = "#399ded";
            else if (n == 6) color = "#329cf0";
            else if (n == 7) color = "#2b99f0";
            else if (n == 8) color = "#2694eb";
            else if (n == 9) color = "#1e90eb";
            else if (n == 10) color = "#188eed";
            else if (n == 11) color = "#138aeb";
            else if (n == 12) color = "#0c88ed";
            let cpu_data2 = [];
            cpu_data.push({
                type: "splineArea", showInLegend: "true", name: `${n}`, yValueFormatString: "#0.#%", color, xValueType: "dateTime",
                xValueFormatString: "DD.MM.YY HH:mm", legendMarkerType: "square", dataPoints: cpu_data2
            });
            for (let i = 0; i < data_.length; i++) {
                if (data_[i].cpus[n] != undefined) cpu_data2.push({ x: data_[i].date, y: parseInt(data_[i].cpus[n].load.replace('%', '')) / 100 });
            }
        }
    }
    var cpuChartOptions = {
        animationEnabled: true,
        theme: "dark2",
        title: {
            text: "Использование CPU"
        },
        toolTip: toolTip,
        axisY: {
            valueFormatString: "#0.#%",
        },
        legend: legend,
        data: cpu_data
    };
    let mem_cache_data = [];
    let mem_total_data = [];
    let mem_load_data = [];
    let mem_used_data = [];
    let mem_swap_free_data = [];
    let mem_swap_used_data = [];
    {
        const _del = 1024 * 1024;
        for (let i = 0; i < data_.length; i++) {
            mem_cache_data.push({ x: data_[i].date, y: data_[i].memory.cache / _del });
            mem_total_data.push({ x: data_[i].date, y: data_[i].memory.total / _del });
            mem_load_data.push({ x: data_[i].date, y: data_[i].memory.load / _del });
            mem_used_data.push({ x: data_[i].date, y: data_[i].memory.used / _del });
            mem_swap_free_data.push({ x: data_[i].date, y: data_[i].memory.swap_free / _del });
            mem_swap_used_data.push({ x: data_[i].date, y: data_[i].memory.swap_used / _del });
        }
    }
    var memoryChartOptions = {
        animationEnabled: true,
        theme: "dark2",
        title: {
            text: "Использование ОЗУ"
        },
        axisY: {
            valueFormatString: "#0.# MB",
        },
        toolTip: toolTip,
        legend: legend,
        data: [{
            type: "splineArea",
            showInLegend: "true",
            name: "Доступно SWAP",
            color: "#8bc11f"+'bf',
            xValueType: "dateTime",
            xValueFormatString: "DD.MM.YY HH:mm",
            yValueFormatString: "# MB",
            legendMarkerType: "square",
            dataPoints: mem_swap_free_data
        },{
            type: "splineArea",
            showInLegend: "true",
            name: "Используется SWAP",
            color: "#4c99ff"+'bf',
            xValueType: "dateTime",
            xValueFormatString: "DD.MM.YY HH:mm",
            yValueFormatString: "# MB",
            legendMarkerType: "square",
            dataPoints: mem_swap_used_data
        },{
            type: "splineArea",
            showInLegend: "true",
            name: "Всего",
            color: "#189dc9"+'bf',
            xValueType: "dateTime",
            xValueFormatString: "DD.MM.YY HH:mm",
            yValueFormatString: "# MB",
            legendMarkerType: "square",
            dataPoints: mem_total_data
        },{
            type: "splineArea",
            showInLegend: "true",
            name: "Нагружено",
            color: "#d32f2f"+'bf',
            xValueType: "dateTime",
            xValueFormatString: "DD.MM.YY HH:mm",
            yValueFormatString: "# MB",
            legendMarkerType: "square",
            dataPoints: mem_load_data
        },{
            type: "splineArea",
            showInLegend: "true",
            name: "Используется",
            color: "#dd4e1f"+'bf',
            xValueType: "dateTime",
            xValueFormatString: "DD.MM.YY HH:mm",
            yValueFormatString: "# MB",
            legendMarkerType: "square",
            dataPoints: mem_used_data
        },{
            type: "splineArea",
            showInLegend: "true",
            name: "Кэш",
            color: "#ddda1f"+'bf',
            xValueType: "dateTime",
            xValueFormatString: "DD.MM.YY HH:mm",
            yValueFormatString: "# MB",
            legendMarkerType: "square",
            dataPoints: mem_cache_data
        }]
    }
    let proc_data = [];
    {
        for (let i = 0; i < data_.length; i++) {
            proc_data.push({ x: data_[i].date, y: data_[i].processes });
        }
    }
    var procChartOptions = {
        animationEnabled: true,
        theme: "dark2",
        title:{
            text: "Количество процессов"
        },
        toolTip: toolTip,
        legend: legend,
        data: [{
            type: "splineArea",
            showInLegend: "true",
            name: "Процессы",
            color: "#c61b8d",
            xValueType: "dateTime",
            xValueFormatString: "DD MMM YY HH:mm",
            yValueFormatString: "#0.##",
            legendMarkerType: "square",
            dataPoints: proc_data
        }]
    }
    let disk_data = [];
    {
        for (let n = 0; n < 3; n++) {
            let color = "#ffb74d";
            if (n == 1) color = "#f57c00";
            let disk_data2 = [];
            let _name = `${n}`;
            if (data_[0].disks[n] != undefined)  _name = data_[0].disks[n].name + ` > ${formatBytes(data_[0].disks[n].usage, 1)}`;
            disk_data.push({
                type: "splineArea", showInLegend: "true", name: _name, yValueFormatString: "#0.#%", color, xValueType: "dateTime",
                xValueFormatString: "DD.MM.YY HH:mm", legendMarkerType: "square", dataPoints: disk_data2
            });
            for (let i = 0; i < data_.length; i++) {
                if (data_[i].disks[n] != undefined) disk_data2.push({ x: data_[i].date, y: parseInt(data_[i].disks[n].load.replace('%', '')) / 100 });
            }
        }
    }
    var diskChartOptions = {
        animationEnabled: true,
        theme: "dark2",
        title: {
            text: "Использование диска"
        },
        axisY: {
            valueFormatString: "#0.#%",
        },
        toolTip: toolTip,
        legend: legend,
        data: disk_data
    }
    charts.push(new CanvasJS.Chart(id + "1", cpuChartOptions));
    charts.push(new CanvasJS.Chart(id + "2", memoryChartOptions));
    charts.push(new CanvasJS.Chart(id + "3", procChartOptions));
    charts.push(new CanvasJS.Chart(id + "4", diskChartOptions));
    for(let zet = 0; zet < data_[data_.length - 1].network.length; zet++){
        const name = data_[data_.length - 1].network[zet].name;
        let display = false;
        let net_i_data = [];
        let net_o_data = [];
        {
            for (let i = 0; i < data_.length; i++) {
                const net = data_[i].network.find(x => x.name == name);
                if(net == null || net == undefined) continue;
                const date = data_[i].date;
                const in_ = net.inbount / 1024 / 1024 / 8;
                const out_ = net.outbount / 1024 / 1024 / 8;
                net_i_data.push({ x: date, y: in_ });
                net_o_data.push({ x: date, y: out_ });
                if(in_ > 0.01 || out_ > 0.01) display = true;
            }
        }
        if(data_[data_.length - 1].network.length < 3) display = true;
        if(!display) continue;
        var networkChartOptions = {
            animationEnabled: true,
            theme: "dark2",
            title:{
                text: "Network Traffic ("+data_[data_.length-1].network[zet].name+")"
            },
            axisY: {
                suffix: " Mbit/s"
            },
            toolTip: toolTip,
            legend: legend,
            data: [{
                type: "splineArea",
                showInLegend: "true",
                name: "Outbound",
                color: "#81c784",
                xValueType: "dateTime",
                xValueFormatString: "DD MMM YY HH:mm",
                yValueFormatString: "#0.## Mbit/s",
                legendMarkerType: "square",
                dataPoints: net_o_data
            },{
                type: "splineArea",
                showInLegend: "true",
                name: "Inbound",
                color: "#388e3c",
                xValueType: "dateTime",
                xValueFormatString: "DD MMM YY HH:mm",
                yValueFormatString: "#0.## Mbit/s",
                legendMarkerType: "square",
                dataPoints: net_i_data
            }]
        }
        const _par = document.getElementById(id + "5");
        const _el = document.createElement('div');
        _el.className = 'col';
        _el.id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});
        _par.appendChild(_el);
        charts.push(new CanvasJS.Chart(_el.id, networkChartOptions));
    }

    for (var i = 0; i < charts.length; i++) {
        charts[i].options.axisX = {
            labelAngle: 0,
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
                valueFormatString: "HH:mm"
            }
        }
    }

    new syncCharts(charts, true, true, true);

    for (var i = 0; i < charts.length; i++) {
        charts[i].render();
        const _new = charts[i].container;
    }

}
class syncCharts {
    constructor(charts, syncToolTip, syncCrosshair, syncAxisXRange) {

        if (!this.onToolTipUpdated) {
            this.onToolTipUpdated = function (e) {
                for (var j = 0; j < charts.length; j++) {
                    if (charts[j] != e.chart)
                        charts[j].toolTip.showAtX(e.entries[0].xValue);
                }
            };
        }

        if (!this.onToolTipHidden) {
            this.onToolTipHidden = function (e) {
                for (var j = 0; j < charts.length; j++) {
                    if (charts[j] != e.chart)
                        charts[j].toolTip.hide();
                }
            };
        }

        if (!this.onCrosshairUpdated) {
            this.onCrosshairUpdated = function (e) {
                for (var j = 0; j < charts.length; j++) {
                    if (charts[j] != e.chart)
                        charts[j].axisX[0].crosshair.showAt(e.value);
                }
            };
        }

        if (!this.onCrosshairHidden) {
            this.onCrosshairHidden = function (e) {
                for (var j = 0; j < charts.length; j++) {
                    if (charts[j] != e.chart)
                        charts[j].axisX[0].crosshair.hide();
                }
            };
        }

        if (!this.onRangeChanged) {
            this.onRangeChanged = function (e) {
                for (var j = 0; j < charts.length; j++) {
                    if (e.trigger === "reset") {
                        charts[j].options.axisX.viewportMinimum = charts[j].options.axisX.viewportMaximum = null;
                        charts[j].options.axisY.viewportMinimum = charts[j].options.axisY.viewportMaximum = null;
                        charts[j].render();
                    } else if (charts[j] !== e.chart) {
                        charts[j].options.axisX.viewportMinimum = e.axisX[0].viewportMinimum;
                        charts[j].options.axisX.viewportMaximum = e.axisX[0].viewportMaximum;
                        charts[j].render();
                    }
                }
            };
        }

        for (var i = 0; i < charts.length; i++) {

            if (syncToolTip) {
                if (!charts[i].options.toolTip)
                    charts[i].options.toolTip = {};

                charts[i].options.toolTip.updated = this.onToolTipUpdated;
                charts[i].options.toolTip.hidden = this.onToolTipHidden;
            }

            if (syncCrosshair) {
                if (!charts[i].options.axisX)
                    charts[i].options.axisX = { crosshair: { enabled: true } };

                charts[i].options.axisX.crosshair.updated = this.onCrosshairUpdated;
                charts[i].options.axisX.crosshair.hidden = this.onCrosshairHidden;
            }

            if (syncAxisXRange) {
                charts[i].options.zoomEnabled = true;
                charts[i].options.rangeChanged = this.onRangeChanged;
            }
        }
    }
}
function formatBytes(bytes, decimals=2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}