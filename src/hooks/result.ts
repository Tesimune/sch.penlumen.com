import { axiosInstance } from '@/lib/axios';

type ResultData = {
  teacher_remark: string;
  principal_remark: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
};

type AssessmentObject = {
  uuid: string;
  assignment: number;
  assessment: number;
  exam: number;
};

type AssessmentData = {
  assessments: AssessmentObject[];
};

export const useResult = () => {
  const index = async () => {
    const response = await axiosInstance.get('/api/v1/result/index');
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

  const create = async () => {
    const response = await axiosInstance.post('/api/v1/result/create');
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
    student_uuid: string,
    resultData: ResultData,
    assessmentData: AssessmentData
  ) => {
    const response = await axiosInstance.patch(
      `/api/v1/result/update/${student_uuid}`,
      {
        result: resultData,
        assessmentData: assessmentData,
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
    index,
    create,
    update,
    remove,
  };
};
