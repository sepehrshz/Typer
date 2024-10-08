<script setup lang="ts">
definePageMeta({
    layout: "header",
})
import * as echarts from 'echarts'
const { t, locale } = useI18n();
const chartContainer = ref(null);
const chart = ref<EChartsType>();
const user = useCookie<{ userName: string, accessToken: string }>('user');
let test: { speed: number[], accuracy: number[], date: string[] };
const getTest = async () => {
    const response: { speed: number[], accuracy: number[], date: string[] } =
        await $fetch('http://localhost:3000/getTest', {
            method: 'POST',
            body: {
                userName: user.value.userName,
                accessToken: user.value.accessToken,
            }
        });
    test = response;
}

onMounted(async () => {
    await getTest();
    initChart();
})

function initChart() {
    const option = {
        tooltip: {
            trigger: 'axis',
        },
        dataZoom: [
            {
                type: 'inside',
            },
        ],
        legend: {
            data: [t('Speed'), t('Accuracy')],
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
                name: t('Speed'),
                color: '#d721ff',
                label: {
                    show: true,
                    position: 'bottom',
                    textStyle: {
                        fontSize: 16
                    }
                }
            },
            {
                data: test.accuracy,
                type: 'line',
                name: t('Accuracy'),
                color: 'gray',
                label: {
                    show: true,
                    position: 'bottom',
                    textStyle: {
                        fontSize: 16
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
    <div style="height: calc(100vh - 80px);" class="flex flex-col w-full justify-center items-center">
        <div ref="chartContainer" class="w-3/4 h-3/4"></div>
        <button @click="() => getChartUrl()" class="w-24 h-11 bg-primary text-white rounded-md text-sm 
            flex justify-center items-center mt-8">{{ t('Download') }}</button>
    </div>
</template>