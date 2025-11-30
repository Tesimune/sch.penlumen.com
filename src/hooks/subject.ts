import { axiosInstance } from '@/lib/axios';

export const useSubject = () => {
  const index = async (class_uuid: string) => {
    const response = await axiosInstance.get(
      `/api/v1/subject/index/${class_uuid}`
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

  const create = async (class_uuid: string, name: string) => {
    const response = await axiosInstance.post(
      `/api/v1/subject/create/${class_uuid}`,
      {
        name,
      }
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

  const update = async (uuid: string, class_uuid: string, name: string) => {
    const response = await axiosInstance.patch(
      `/api/v1/subject/update/${uuid}`,
      {
        name,
        class_uuid,
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
      `/api/v1/subject/delete/${uuid}`
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
