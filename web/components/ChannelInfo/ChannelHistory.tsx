import ReactECharts from "echarts-for-react";
import useSWR from "swr";
import {AggregateDays} from "../../pages/[...channel]";
import {useTheme} from "next-themes";

const stringToRGB = function (str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    const str = ("00" + value.toString(16));
    colour += str.substring(str.length - 2);
  }
  return colour;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

type ChannelHistory = {
  channel: string,
  type: AggregateDays
}

const ChannelHistory = ({channel, type}: ChannelHistory) => {
  const { theme } = useTheme();

  const {
    data,
    error
  } = useSWR(`http://192.168.1.104:5000/api/v1/history/${channel}${type === AggregateDays.Default ? "" : `/${type.toString()}`}`,
    fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });

  if (error) {
    return <div>Chart Error. :/</div>;
  }

  if (!data) {
    return <ReactECharts className={"mt-4"} style={{width: "100%", minHeight: "480px"}}
                         showLoading={true}
                         loadingOption={{textColor: "#fff", maskColor: "rgba(255, 255, 255, 0)"}}
                         option={{}} notMerge={true}/>;
  }

  const lines = [];
  for (let i = 1; i < data.channels.length; i++) {
    const color = stringToRGB(data.channels[i]);
    lines.push({
      type: "line",
      itemStyle: {
        color: color
      },
      lineStyle: {
        color: color
      },
      emphasis: {
        focus: "series"
      },
      animationDuration: 500
    });
  }

  const legendData = data.channels.slice(1).sort();
  const option = {
    textStyle: {
      fontFamily: "Inter",
      color: "#fff"
    },
    legend: {
      textStyle: {
        color: "#fff"
      },
      pageTextStyle: {
        color: "#fff"
      },
      pageIconColor: "#aaa",
      pageIconInactiveColor: "#2f4554",
      inactiveColor: "#5b5b5b",
      type: "scroll",
      data: legendData
    },
    grid: {
      left: "7%",
      right: "5%"
    },
    dataZoom: [{
      type: "slider",
      startValue: data.history.length > 24 ? data.history.length - 24 : 0,
      end: 100,
      rangeMode: ["value", "percent"]
    }],
    tooltip: {
      trigger: "axis",
      formatter: function (params: { name: string, seriesName: string, value: { [x: string]: any }, [x: string]: any }[]) {
        let output;
        if (window.location.pathname.split("/").length > 2) {
          output = `<div class="mb-2"><b>${params[0].name}</b></div>`;
        } else {
          output = `<div class="mb-2"><b>${params[0].name}</b></div>`;
        }
        const values: [string, number][] = Object.entries(params[0].value).filter(x => x[0] !== "timestamp");
        for (let i = 0; i < values.length; i++) {
          const param = params.find((x: { seriesName: string; }) => x.seriesName === values[i][0]);
          if (param == null) {
            continue;
          }
          output += `<div class="flex justify-between"><div class="mr-4">${param.marker}${values[i][0]}</div><div class="font-mono">${values[i][1].toLocaleString()}</div></div>`;
        }
        return output;
      }
    },
    dataset: {
      dimensions: data.channels,
      source: [...data.history].reverse()
    },
    xAxis: {
      type: "category"
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false
      },
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    series: lines,
    media: [{
      query: {
        maxWidth: 600
      },
      option: {
        grid: {
          left: "12%",
          right: "6%"
        },
      }
    },]
  };

  if (theme !== "dark") {
    option.textStyle = {
      fontFamily: "Inter",
      color: "#000"
    };
    option.legend = {
      textStyle: {
        color: "#000"
      },
      inactiveColor: "#d3d3d3",
      type: "scroll",
      pageTextStyle: {
        color: "#000"
      },
      pageIconColor: "#2f4554",
      pageIconInactiveColor: "#aaa",
      data: legendData
    };
  }

  return (
    <ReactECharts className={"mt-4"} style={{width: "100%", minHeight: "480px"}} option={option} notMerge={true}/>
  );
};

export default ChannelHistory;
