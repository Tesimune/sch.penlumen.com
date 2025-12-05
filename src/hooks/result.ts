import {axiosInstance} from '@/lib/axios';

type ResultData = {
    teacher_remark: string | null;
    principal_remark: string | null;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
};

type AssessmentObject = {
    uuid: string;
    subject: string;
    assignment: number;
    assessment: number;
    examination: number;
    overall: number;
};

export const useResult = () => {
    const index = async (statusFilter: string) => {
        const response = await axiosInstance.get(
            `/api/v1/result/index?status=${statusFilter}`
        );
        const data = response.data;

        if (!data.success || !data.data) {
            return {
                success: false,
                message: data.message || 'Something went wrong',
            };
        } else {
            return {
                success: true,
                data: data.data,
            };
        }
    };

    const show = async (student_uuid: any) => {
        const response = await axiosInstance.get(
            `/api/v1/result/show/${student_uuid}`
        );
        const data = response.data;

        if (!data.success || !data.data) {
            return {
                success: false,
                message: data.message || 'Something went wrong',
            };
        } else {
            return {
                success: true,
                data: data.data,
            };
        }
    };

    const view = async (result_uuid: string) => {
        const response = await axiosInstance.get(
            `/api/v1/result/view/${result_uuid}`
        );
        const data = response.data;

        if (!data.success || !data.data) {
            return {
                success: false,
                message: data.message || 'Something went wrong',
            };
        } else {
            return {
                success: true,
                data: data.data,
            };
        }
    };

    const create = async (student_uuid: string) => {
        const response = await axiosInstance.post(
            `/api/v1/result/create/${student_uuid}`
        );
        const data = response.data;

        if (!data.success || !data.data) {
            return {
                success: false,
                message: data.message || 'Something went wrong',
            };
        } else {
            return {
                success: true,
                data: data.data,
            };
        }
    };

    const update = async (
        result_uuid: string,
        resultData: ResultData,
        assessmentData: AssessmentObject[]
    ) => {
        const response = await axiosInstance.patch(
            `/api/v1/result/update/${result_uuid}`,
            {
                result: resultData,
                assessments: assessmentData,
            }
        );
        const data = response.data;

        if (!data.success) {
            return {
                success: false,
                message: data.message || 'Something went wrong',
            };
        } else {
            return {
                success: true,
                data: data.data,
            };
        }
    };

    const remove = async (uuid: string) => {
        const response = await axiosInstance.delete(
            `/api/v1/result/delete/${uuid}`
        );
        const data = response.data;
        if (!data.success) {
            return {
                success: false,
                message: data.message || 'Something went wrong',
            };
        } else {
            return {
                success: true,
                data: data.data,
            };
        }
    };

    return {
        show,
        view,
        index,
        create,
        update,
        remove,
    };
};
