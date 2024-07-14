<script setup lang="ts">
import * as echarts from 'echarts'
const props = defineProps<{ lessonId: number }>();
const chartContainer = ref(null)
const chart = ref<EChartsType>();
const user = useCookie<{ userName: string, accessToken: string }>('user');
let test: { speed: number[], accuracy: number[], date: string[] };
const getTest = async () => {
    const response: { speed: number[], accuracy: number[], date: string[] } =
        await $fetch('http://localhost:3000/getPractice', {
            method: 'POST',
            body: {
                userName: user.value.userName,
                lessonId: props.lessonId,
                accessToken: user.value.accessToken,
            }
        });
    test = response;
    console.log(test)
}

onMounted(async () => {
    await getTest();
    let x;
    if (test.speed.length == 1) {
        x = 1;
    }
    if (test.speed.length < 6) {
        x = 9;
    }
    else {
        x = (1 - (6 / test.speed.length)) * 100;
    }
    initChart(x);
})

function initChart(x: number) {
    const option = {
        tooltip: {
            trigger: 'axis',
        },
        dataZoom: [
            {
                type: 'inside',
                start: x,
                end: 100
            }
        ],
        legend: {
            data: ['Speed', 'Accuracy'],
            orient: 'horizontal',
            right: 'center',
            top: 'bottom',
        },
        xAxis: {
            data: test.date
        },
        yAxis: {},
        series: [
            {
                data: test.speed,
                type: 'line',
                name: 'Speed',
                color: '#d721ff',
                label: {
                    show: true,
                    position: 'bottom',
                    textStyle: {
                        fontSize: 12
                    }
                }
            },
            {
                data: test.accuracy,
                type: 'line',
                name: 'Accuracy',
                color: 'gray',
                label: {
                    show: true,
                    position: 'bottom',
                    textStyle: {
                        fontSize: 12
                    }
                }
            }
        ]
    }

    const chartInstance = echarts.init(chartContainer.value)
    chart.value = chartInstance;
    chartInstance.setOption(option)
}

const getChartUrl = () => {
    const chartUrl = chart.value.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    downloadImage(chartUrl);
}

const downloadImage = (url: any) => {
    const imageUrl = url;

    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'chart.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
        });
}

</script>
<template>
    <div class="flex flex-col h-full w-full justify-center items-center">
        <div ref="chartContainer" class="h-full w-full"></div>
    </div>
</template>