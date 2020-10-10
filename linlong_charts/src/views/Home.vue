<template>
    <div class="home">
        <!-- title-->
        <el-tabs :stretch="true" class="my-style-tabs">
            <!-- title 上传 -->
            <el-tab-pane name="upload">
                <div slot="label" class="item">
                    <p>上传</p>
                    <div class="num">
                        <span style="color: #F6E5AF">{{ tab.upload_day||0 }}</span>
                        ｜
                        <span style="color: #886FF7">{{ tab.upload_all }}</span>
                    </div>
                </div>
            </el-tab-pane>
            <!-- title 点击  -->
            <el-tab-pane name="click">
                <div slot="label" class="item">
                    <p>点击</p>
                    <div class="num">
                        <span style="color:#D8D8EF"></span>
                        {{ tab.click_day||0 }}｜
                        <span style="color: #886FF7">{{ tab.click_all }}</span>
                    </div>
                </div>
            </el-tab-pane>
            <!-- title 曝光  -->
            <el-tab-pane name="show">
                <div slot="label" class="item">
                    <p>曝光</p>
                    <div class="num">
                        <span style="color: #F6E5AF">{{ tab.show_day||0 }}</span>｜
                        <span style="color: #886FF7">{{ tab.show_all }}</span>
                    </div>
                </div>
            </el-tab-pane>
            <!-- title 未播  -->
            <el-tab-pane name="noduration">
                <div slot="label" class="item">
                    <p>未播</p>
                    <div class="num">
                        <span style="color:#D8D8EF"></span>
                        {{ tab.noduration_day||0 }}｜
                        <span style="color: #886FF7">{{ tab.noduration_all }}</span>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- 报表 -->
        <div class="card-box">
            <!-- 点击量 -->
            <el-card shadow="never" style="width: 100%" class="card">
                <div slot="header">
                    <span class="label">点击量</span>
                    <router-link to="/detail/click">
                        <el-button style="float: right;" type="text">More <i class="el-icon-arrow-right"></i></el-button>
                    </router-link>
                </div>
                <div style="position: relative">
                    <v-chart ref="clickChart" :autoresize="true" :options="clickOpt" style="width: 100%;height: 290px" />
                    <div class="show-title-label" v-show="clickOptShowNoDataLabel">{{ clickOptShowNoDataLabel }}</div>
                </div>
                <div class="select-week" style="text-align: center">
                    <el-radio-group v-model="clickOptWeekOrMouth" size="mini">
                        <el-radio-button label="month">按月</el-radio-button>
                        <el-radio-button label="week">按周</el-radio-button>
                    </el-radio-group>
                </div>
            </el-card>
            <!-- 完播 -->
            <el-card shadow="never" style="width: 100%" class="card">
                <div slot="header">
                    <span class="label">完播</span>
                    <router-link to="/detail/completion">
                       <el-button style="float: right;" type="text">More <i class="el-icon-arrow-right"></i></el-button>
                    </router-link>
                </div>
                <v-chart ref="barChart" :autoresize="true" :options="barOpt" style="width: 100%" />
            </el-card>
            <el-card shadow="never" style="width: 50%;" class="card">
                <div slot="header">
                    <span class="label">播放比率</span>
                    <!-- <el-button style="float: right;" type="text">More</el-button> -->
                </div>
                <v-chart ref="ratioChart" :autoresize="true" :options="ratioOpt" style="width: 100%" class="top"/>
            </el-card>
            <!-- 作者排名 -->
            <el-card shadow="never" style="width: calc(50% - 20px);margin-left: 20px" class="card">
                <div slot="header">
                    <span class="label">
                        作者排名
                        <span style="font-size: 12px">（点击/上传/话题热度）</span>
                    </span>
                </div>
                <ul v-loading="avatarNumLoading" class="avatar-num">
                    <li v-for="(v, index) in authorList" :key="v.author_name">
                        <el-avatar :src="v.image_url" icon="el-icon-user-solid" size="small" style="flex-shrink: 0" />
                        <div class="avatar-label">
                            {{ v.author_name }}
                            <span class="avatar-label-signature">{{ v.signature || '这个人很懒，暂无介绍！' }}</span>
                        </div>
                        <div class="num">{{ ++index }}</div>
                    </li>
                </ul>
            </el-card>
            <!--  -->
        </div>
    </div>
</template>

<script>
    import ECharts from "vue-echarts";
    import "echarts/lib/chart/line";
    import "echarts/lib/chart/pie";
    import "echarts/lib/chart/bar";
    import "echarts/lib/component/tooltip";
    import "echarts/lib/component/legend";
    import "echarts/lib/component/title";
    import "echarts/lib/component/dataZoom";
    import "echarts/lib/component/legendScroll";

    import {
        apiWhole,
        apiTopic,
        apiComparte,
        apiAuthor,
        apiClickNums,
    } from "../require/api";
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: "Home",
        components: {
            "v-chart": ECharts,
        },
        data() {
            return {
                tab: {
                    show_all: "",
                    show_day: "",
                    click_day: "",
                    click_all: "",
                    upload_day: "",
                    upload_all: "",
                },
                tabActiveName: "upload",
                authorList: [],
                //点击量
                clickOpt: {
                    legend: {
                         left: "6%",
                        data: ["点击", "曝光"],
                    },
                    color: ["#FFE66F", "#886ff7"],
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "cross",
                            label: {
                                backgroundColor: "#6a7985",
                            },
                        },
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: [],
                    },
                    yAxis: {
                        type: "value",
                    },
                    series: [{
                            name: "点击",
                            data: [],
                            type: "line",
                            connectNulls: true,
                        },
                        {
                            name: "曝光",
                            data: [],
                            type: "line",
                            connectNulls: true,
                        },
                    ],
                },
                clickOptWeekOrMouth: "month",
                clickOptShowNoDataLabel: "",
                //播放比率
                ratioOpt: {
                    title: {
                        text: "完播占比",
                        left: "center",
                        top: "center",
                        textStyle: {
                            fontWeight: "normal",
                            color: "#555",
                            fontSize: 14,
                        },
                    },
                   
                    color: [
                        "#886ff7",
                        "#d8d8ef",
                        "#f0a73f",
                        "#e8e8e8",
                        "#fffec9",
                        "#f5e5af",
                        "#33378b",
                    ],
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b}: {c} ({d}%)",
                    },
                    grid: {
                      
                       bottom:"10%"
                    },
                    legend: {
                        //width: "70%",
                        orient: "vertical",
                         height: "10%",
                        bottom: "left",
                       align: "auto",
                        data: [
                            "未播",
                            "占总时长：0-20%",
                            "占总时长：20-40%",
                            "占总时长：40-60%",
                            "占总时长：60-80%",
                            "占总时长：80-100%",
                            "完整播放",
                        ],
                    },

                    series: [{
                        name: "占总时常",
                        type: "pie",
                        radius: ["40%", "49%"],
                        label: {
                            color: "#333",
                            show: true,
                            formatter: "{d}%",
                        },
                        labelLine: {
                            length: 5,
                            length2: 10,
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: "12",
                                formatter: "{a}{d}%",
                            },
                        },
                        data: [],
                    }, ],
                },
                
                //完播
                barOpt: {
                    color: ["#4848b5", "#a79ef7"],
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow",
                        },
                        formatter: function(params) {
                            console.log(params);

                            // var res = 'Function formatter : <br/>' + params[0].name;
                            // for (var i = 0, l = params.length; i < l; i++) {
                            //   res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                            return `主题：${params[0].name}
<br />${params[0].seriesName}:
${params[0].value}<br />
${params[1].seriesName}:
${params[1].value}<br />
比例：${((params[0].value / params[1].value) * 100).toFixed(0)}%`;
                        },
                    },
                    legend: {
                        left: "7%",
                        
                        data: ["点击", "完播"],
                    },
                    xAxis: [{
                        type: "category",
                        data: [],
                        axisTick: {
                            interval: 0,
                        },
                    }, ],
                    yAxis: [{
                        type: "value",
                    }, ],
                    dataZoom: [{
                        // 这个dataZoom组件，默认控制x轴。
                        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                        start: 1, // 左边在 10% 的位置。
                        end: 4, // 右边在 60% 的位置。
                    }, ],
                    series: [{
                            name: "完播",
                            type: "bar",
                            stack: "广告",
                            data: [],
                        },
                        {
                            name: "点击",
                            type: "bar",
                            stack: "广告",
                            data: [],
                        },
                    ],
                },
                once: true,
                avatarNumLoading: true,
            };
        },
        mounted() {
            this.initGetData();
        },
        watch: {
            tabActiveName() {
                this.initGetData();
            },
            clickOptWeekOrMouth() {
                apiClickNums({
                    type: this.clickOptWeekOrMouth,
                }).then((r) => {
                    this.apiClickNumsSuccess(r);
                });
            },
        },
        methods: {
            initGetData() {
                // this.$refs.clickChart.showLoading()
                if (this.tabActiveName !== "noduration") {
                    apiClickNums({
                        type: this.clickOptWeekOrMouth,
                    }).then((r) => {
                        this.apiClickNumsSuccess(r);
                        console.log(r);
                    });
                } else {
                    this.clickOptShowNoDataLabel = "完播不能有点击数据！";
                }

                if (this.tabActiveName === "upload" && this.once) {
                    this.once = false;
                    apiWhole({
                        type: this.tabActiveName,
                    }).then((r) => {
                        this.tab.show_day = r.data[0].show_day;
                        this.tab.show_all = r.data[0].show_all;
                        this.tab.click_day = r.data[1].click_day;
                        this.tab.click_all = r.data[1].click_all;
                        this.tab.upload_day = r.data[2].upload_day;
                        this.tab.upload_all = r.data[2].upload_all;
                        this.tab.noduration_day = r.data[3].noduration_day;
                        this.tab.noduration_all = r.data[3].noduration_all;
                    });
                    this.$refs.barChart.showLoading();
                    apiTopic().then((r) => {
                        this.$refs.barChart.hideLoading();
                        this.barOpt.xAxis[0].data = r.data.topic_id;
                        this.barOpt.series[0].data = r.data.click_times;
                        this.barOpt.series[1].data = r.data.pv_times;
                    });
                    this.$refs.ratioChart.showLoading();
                    apiComparte().then((r) => {
                        this.$refs.ratioChart.hideLoading();
                        const arr = [];
                        let j = 0;
                        for (const i in r.data[0]) {
                            j += 1;
                            arr.push({
                                name: this.ratioOpt.legend.data[j],
                                value: r.data[0][i],
                            });
                        }
                        this.ratioOpt.series[0].data = arr;
                    });
                    this.avatarNumLoading = true;
                    apiAuthor().then((r) => {
                        this.avatarNumLoading = false;
                        this.authorList = r.data;
                    });
                }
            },
            apiClickNumsSuccess(r) {
                // this.$refs.clickChart.hideLoading()
                if (r.data.click_nums.length === 0)
                    this.clickOptShowNoDataLabel = "暂无数据！";
                else this.clickOptShowNoDataLabel = "";
                // console.log(this.clickOpt);
                this.clickOpt.xAxis.data = r.data.days;
                this.clickOpt.series[0].data = r.data.click_nums;
                this.clickOpt.series[1].data = r.data.show_nums;
            },
        },
    };
</script>
<style lang="scss">
    .home {
        .el-tabs__nav-wrap {
            &:after {
                height: 0;
            }
        }

        .el-tabs__item {
            height: auto;
        }

        .my-style-tabs {
            background-color: #fff;
            padding: 20px 20px 0;

            .el-tabs__active-bar {
                background-color: #fff;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .top{
        margin-top: -12%;
    }
    .item {
        padding-bottom: 5px;

        p,
        a {
            font-size: 12px;
            line-height: 1;
            margin: 0;
            display: block;
            font-weight: 300;
        }

        p {
            color: #777;
        }

        a {
            color: #33378b;
        }

        .num {
            font-size: 30px;
            font-weight: 300;
            margin: 10px 0;
            color: #c3cfd5;
        }
    }

    .card-box {
        display: flex;
        flex-wrap: wrap;

        .card {
            margin-top: 20px;
            position: relative;

            .show-title-label {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .label {
                font-size: 14px;
                color: #999;
            }

            ul.avatar-num {
                margin: 0 auto;
                width: 70%;
                min-height: 310px;
                list-style: none;

                li {
                    display: flex;
                    margin-bottom: 20px;

                    .avatar-label {
                        flex-grow: 1;
                        margin-left: 10px;
                        line-height: 1;
                        overflow: hidden;

                        span {
                            font-size: 12px;
                            color: #999;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            display: block;
                            overflow: hidden;
                            line-height: 1.65;
                        }
                    }

                    .num {
                        flex-shrink: 0;
                        font-size: 12px;
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        border-radius: 50%;
                        text-align: center;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }

                    &:nth-child(1) {
                        .num {
                            color: #fff;
                            background-color: red;
                        }
                    }

                    &:nth-child(2) {
                        .num {
                            color: #fff;
                            background-color: #777777;
                        }
                    }

                    &:nth-child(3) {
                        .num {
                            color: #fff;
                            background-color: orange;
                        }
                    }

                    &:nth-child(4) {
                        .num {
                            color: #fff;
                            background-color: #ffe611;
                        }
                    }
                }
            }
        }
    }
</style>
