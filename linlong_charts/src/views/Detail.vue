<template>
    <div class="detail">
        <el-card shadow="never">
            <el-form :inline="true" :model="filterForm">
                <el-form-item label="ID">
                    <el-input v-model="filterForm.video_id" placeholder="请输入视频ID" />
                </el-form-item>
                <el-form-item label="类别">
                    <el-input v-model="filterForm.topic" placeholder="请输入视频类别" />
                    <!--          <el-select v-model="filterForm.type" placeholder="选择视频类别">-->
                    <!--            <el-option label="全部" value="-1"></el-option>-->
                    <!--            <el-option label="区域二" value="beijing"></el-option>-->
                    <!--          </el-select>-->
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="filterForm.title" placeholder="请输入视频标题" />
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-date-picker style="width: 230px" range-separator="-" prefix-icon="" v-model="filterForm.date"
                        value-format="yyyyMMdd" type="daterange" disabledDate :picker-options="pickerOptions"
                        start-placeholder="From" end-placeholder="To">
                    </el-date-picker>
                </el-form-item>
                <el-button type="primary" @click="currentPage=1;init()">筛选</el-button>
            </el-form>
        </el-card>
        <el-card shadow="never" style="margin-top: 20px">
            <div slot="header">
                <span>查询结果</span>
                <a :href="`${prodHttp}/flask_data/${typeRouterData}_metrics?type=${weekOrDetail}&video_id${filterForm.video_id}=&topic${filterForm.topic}=&title=${filterForm.title}&dates=${filterForm.date.join()}&page=${currentPage}&download=result`"
                    download>
                    <el-button type="primary" style="float: right;margin-left: 10px" size="mini" icon="el-icon-download">
                        下载表格
                    </el-button>
                </a>

                <el-popover  :placement="bottom" v-for="pop in ['week_collect','week_detail']" :key="pop" class="my-popover" style="float: right;"
                    placement="top" width="492" v-model="visible[pop]">
                    <el-checkbox :indeterminate="isCheckedAll[typeRouterData+'_'+pop+'_isIndeterminate']" v-model="isCheckedAll[typeRouterData+'_'+pop+'_checkAll']"
                        @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group class="my-checkbox-grop" v-model="checkedOptions[typeRouterData+'_'+pop+'_checkedCities']"
                        @change="handleCheckedCitiesChange">
                        <el-checkbox style="width: 125px" v-for="v in checkedOptions[typeRouterData+'_'+pop+'_checkedList']"
                            :label="v.key" :key="v.key">
                            {{ language?v.key:v.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                    <br>
                    <div style="text-align: left; margin: 0">
                        <el-button v-model="language" :type="language?'danger':'success'" size="mini" circle @click="language=!language">
                            {{ language?'英':'中' }}
                        </el-button>
                        <el-button size="mini" type="text" @click="visible[pop] = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="weekOrDetail=pop,init(),visible[pop]=false">
                            确定
                        </el-button>
                    </div>
                    <el-button slot="reference" size="mini" @click="weekOrDetailSelect=pop">
                        {{ pop==='week_detail'?'明细':'汇总' }}
                    </el-button>
                </el-popover>
            </div>
            <el-table v-loading="tableDataLoading" :data="tableData" tooltip-effect="dark" height="60vh">
                <el-table-column type="selection" width="45" fixed />
                <el-table-column v-for="col in checkedOptions[typeRouterData+'_'+weekOrDetail+'_checkedCities']" :key="col"
                    :prop="col" :label="language?col:checkedOptions[typeRouterData + '_' +weekOrDetail+ '_checkedList'].find(v => v.key === col).label"
                    min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="col==='vod_address'">
                            <el-popover trigger="click" placement="top">
                                <video :src="scope.row[col]" controls width="252" />
                                <div slot="reference" :title="scope.row[col]">
                                    <el-tag size="medium">点击观看</el-tag>
                                </div>
                            </el-popover>
                        </span>
                        <span v-else>
                            {{ scope.row[col] }}
                        </span>

                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-pagination background :current-page.sync="currentPage" :page-size="100" :total="total" />
        </el-card>
    </div>
</template>
<script>
    import {
        apiDetails
    } from '../require/api'
    import {
        prodHttp
    } from '../require/http'

    export default {
        props: ['typeRouterData'],
        data() {
            const clickWeekDetailCheckedList = [{
                    key: 'week',
                    label: '周'
                },
                {
                    key: 'num_click_in_hue',
                    label: ' 周内总点击次数'
                },
                {
                    key: 'num_video_clicked',
                    label: ' 被点击视频个数'
                },
                {
                    key: 'num_video_showed',
                    label: ' 周内总曝光次数'
                },
                {
                    key: 'clicked_ratio',
                    label: ' 周内点击率'
                }
            ]
            const clickWeekDetailCheckedList2 = [{
                    key: 'video_id',
                    label: '视频ID'
                },
                {
                    key: 'week',
                    label: '统计周'
                },
                {
                    key: 'title',
                    label: '视频标题'
                },
                {
                    key: 'duration',
                    label: '视频时长'
                },
                {
                    key: 'nick_name',
                    label: '用户昵称'
                },
                {
                    key: 'user_id',
                    label: '用户ID'
                },
                {
                    key: 'num_clicked_weekly',
                    label: '周点击次数'
                },
                {
                    key: 'num_showed_weekly',
                    label: '周展现次数'
                },
                {
                    key: 'click_ratio',
                    label: '点击率'
                },
                {
                    key: 'publish_time',
                    label: '上传时间'
                },
                {
                    key: 'media_type',
                    label: '类型'
                },
                {
                    key: 'examine_status',
                    label: '测试状态'
                },
                {
                    key: 'topic',
                    label: '所属话题'
                },
                {
                    key: 'words',
                    label: '视频标签'
                },
                {
                    key: 'vod_address',
                    label: '视频地址'
                },
                {
                    key: 'is_deleted',
                    label: '是否删除'
                },
                {
                    key: 'privacy',
                    label: '权限'
                },
                {
                    key: 'small_cover_url',
                    label: '图片链接'
                }
            ]
            const completionWeekDetailCheckedList = [{
                    key: 'week',
                    label: '周'
                },
                {
                    key: 'num_pv_in_hue',
                    label: ' 视频播放次数'
                },
                {
                    key: 'num_video_watched',
                    label: ' 视频播放个数'
                },
                {
                    key: 'num_video_full_watched',
                    label: ' 视频完播个数'
                },
                {
                    key: 'full_watched_ratio',
                    label: ' 周内完播率'
                }
            ]
            const completionWeekDetailCheckedList2 = [{
                    key: 'video_id',
                    label: '视频ID'
                },
                {
                    key: 'week',
                    label: '统计周'
                },
                {
                    key: 'title',
                    label: '视频标题'
                },
                {
                    key: 'duration',
                    label: '视频时长'
                },
                {
                    key: 'nick_name',
                    label: '用户昵称'
                },
                {
                    key: 'user_id',
                    label: '用户ID'
                },
                {
                    key: 'num_watched_weekly',
                    label: '周播次数'
                },
                {
                    key: 'num_full_watched_weekly',
                    label: '周完播次数'
                },
                {
                    key: 'full_watched_ratio',
                    label: '完播率'
                },
                {
                    key: 'publish_time',
                    label: '上传时间'
                },
                {
                    key: 'media_type',
                    label: '类型'
                },
                {
                    key: 'examine_status',
                    label: '测试状态'
                },
                {
                    key: 'topic',
                    label: '所属话题'
                },
                {
                    key: 'words',
                    label: '视频标签'
                },
                {
                    key: 'vod_address',
                    label: '视频地址'
                },
                {
                    key: 'is_deleted',
                    label: '是否删除'
                },
                {
                    key: 'privacy',
                    label: '权限'
                },
                {
                    key: 'small_cover_url',
                    label: '图片链接'
                }
            ]
            return {
                prodHttp: prodHttp,
                pickerOptions: { // 时间选择器配置项
                    disabledDate(actDate) {
                        return !(actDate.getDay() === 5 || actDate.getDay() === 4)
                    }
                },
                weekOrDetail: 'week_detail', // 周详情
                weekOrDetailSelect: 'week_detail', // 多选框的
                visible: {
                    week_detail: false, // 周详情弹框
                    week_collect: false // 周汇总弹框
                },
                language: false, // 使用语言
                checkedOptions: {
                    click_week_detail_checkedCities: clickWeekDetailCheckedList2.map(v => v.key), // 周汇总多选列的值
                    click_week_detail_checkedList: clickWeekDetailCheckedList2, // 周汇总列选项
                    click_week_collect_checkedCities: clickWeekDetailCheckedList.map(v => v.key), // 周汇总多选列的值
                    click_week_collect_checkedList: clickWeekDetailCheckedList, // 周汇总列选项
                    completion_week_detail_checkedCities: completionWeekDetailCheckedList2.map(v => v.key), // 周汇总多选列的值完播
                    completion_week_detail_checkedList: completionWeekDetailCheckedList2, // 周汇总列选项完播
                    completion_week_collect_checkedCities: completionWeekDetailCheckedList.map(v => v.key), // 周汇总多选列的值完播
                    completion_week_collect_checkedList: completionWeekDetailCheckedList // 周汇总列选项完播
                },
                isCheckedAll: {
                    click_week_collect_checkAll: true,
                    click_week_collect_isIndeterminate: false,
                    click_week_detail_checkAll: true,
                    click_week_detail_isIndeterminate: false, // 用于全选
                    completion_week_detail_checkAll: true, // 用于全选
                    completion_week_detail_isIndeterminate: false, // 用于全选
                    completion_week_collect_checkAll: true, // 用于全选
                    completion_week_collect_isIndeterminate: false // 用于全选
                },
                filterForm: {
                    video_id: '',
                    topic: '',
                    title: '',
                    date: []
                }, // 筛选项
                tableData: [], // 表格数据
                tableDataLoading: true, // 表格loading
                currentPage: 1, // 当前分页页面
                total: 1 // 表格数据条目
            }
        },
        created() {
            this.init()
        },
        watch: {
            currentPage(n) {
                this.init()
            }
        },
        methods: {
            init() {
                this.tableDataLoading = true
                apiDetails(this.typeRouterData, {
                    type: this.weekOrDetail,
                    ...this.filterForm,
                    dates: this.filterForm.date.join(),
                    page: this.currentPage
                }).then(r => {
                    this.tableDataLoading = false
                    this.tableData = r.data
                    this.total = r.data_page
                })
            },
            copyId(val) {
                const input = document.createElement('input')
                input.id = 'copy-hidden-input'
                const inputCopy = document.body.appendChild(input)
                inputCopy.value = val
                inputCopy.select()
                document.execCommand('Copy')
            },
            handleCheckAllChange(val) {
                this.checkedOptions[this.typeRouterData + '_' + this.weekOrDetailSelect + '_checkedCities'] = val ?
                    this.checkedOptions[this.typeRouterData + '_' + this.weekOrDetailSelect + '_checkedList'].map(v =>
                        v.key) : []
                this.isCheckedAll[this.typeRouterData + '_' + this.weekOrDetailSelect + '_isIndeterminate'] = false
            },
            handleCheckedCitiesChange(value) {
                const checkedCount = value.length
                const citiesLength = this.checkedOptions[this.typeRouterData + '_' + this.weekOrDetailSelect +
                    '_checkedList'].map(v => v.key).length
                this.isCheckedAll[this.typeRouterData + '_' + this.weekOrDetailSelect + '_checkAll'] = checkedCount ===
                    citiesLength
                this.isCheckedAll[this.typeRouterData + '_' + this.weekOrDetailSelect + '_isIndeterminate'] =
                    checkedCount > 0 && checkedCount < citiesLength
            }
        }
    }
</script>
<style lang="scss">
    .my-popover {
        &:last-child {
            margin: 0 10px
        }
    }

    .my-checkbox-grop {
        .el-checkbox.is-checked {
            .el-checkbox__label {
                color: #606266;
            }
        }
    }

    //样式穿透 /deep/
    .el-checkbox__label {
        font-size: 8px;
        // border:1px solid red;
    }

    .el-checkbox-group {
        //border:1px solid red;

    }

    .el-popper {
        width: 353px !important;
        padding-left: 41px;
    }

    .el-checkbox {
        margin-right: 0px;
    }

    .el-checkbox {
        width: 99px !important;
    }

    .el-button {
        font-size: 4px !important;
    }
</style>
