var UpdateTPS = () => socket.emit('tps');
window.addEventListener("load", function() {
    const toolTip = {
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
    UpdateTPS();
    //setInterval(() => UpdateTPS(), 30000);
    socket.on('tps', async(servers) => {
        const __data = servers.sort(function (a, b) {return ('' + a.name).localeCompare(b.name)});
        for (let i = 0; i < __data.length; i++) {
            await sleep(i * 10);
            const ___data = __data[i];
            LoadLaterStats(___data)
        }
        await sleep(100);
    });
    function LoadLaterStats(data) {
        let _data = [];
        let _dataPl = [];
        {
            for (let i = 0; i < data.tps.length; i++) {
                const _e = data.tps[i];
                if(_e.tps < 280){
                    _data.push({ x: _e.date, y: parseInt(_e.tps) });
                    let pls = parseInt(_e.players);
                    if(isNaN(pls)) pls = 0;
                    _dataPl.push({ x: _e.date, y: pls });
                }
            }
        }
        const ChartOptions = {
            animationEnabled: true,
            theme: "dark2",
            title: {
                text: `TPS на '${data.name}'`
            },
            toolTip,
            legend: legend,
            data: [{
                type: "splineArea",
                showInLegend: "true",
                name: data.name,
                color: "#d32f2f",
                xValueType: "dateTime",
                xValueFormatString: "DD.MM.YY HH:mm:ss",
                yValueFormatString: "#00 TPS",
                legendMarkerType: "square",
                dataPoints: _data
            },{
                type: "splineArea",
                showInLegend: "true",
                name: data.name,
                color: "#2f91d380",
                xValueType: "dateTime",
                xValueFormatString: "DD.MM.YY HH:mm:ss",
                yValueFormatString: "#0 игроков",
                legendMarkerType: "square",
                dataPoints: _dataPl
            }]
        };
        const uid = guid();
        const _new = document.createElement("div");
        _new.id = uid;
        const _newParent = document.createElement("div");
        _newParent.appendChild(_new);
        {
            const __new = document.createElement("div");
            __new.className = 't8';
            _newParent.appendChild(__new);
        }
        document.getElementById('canvas_area').appendChild(_newParent);
        const _chart = new CanvasJS.Chart(uid, ChartOptions);
        _chart.options.axisX = {
            labelAngle: 0,
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
                valueFormatString: "HH:mm"
            }
        }
        new syncCharts([_chart], true, true, true);
        _chart.render();
    }
});
const difference = function (a, b) { return Math.abs(a - b); }
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
const guid = function(){return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}