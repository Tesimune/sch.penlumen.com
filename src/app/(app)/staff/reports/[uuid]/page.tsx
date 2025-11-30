'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Save, Edit, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useResult } from '@/hooks/result';
import { useParams } from 'next/navigation';
import IsLoading from '@/components/is-loading';

interface StudentData {
  uuid: string;
  name: string;
  reg_number: string;
  avatar: string | null;
}

interface ReportData {
  uuid: string;
  class_name: string;
  student: StudentData;
  student_uuid: string;
  overall: number;
  teacher_remark: string | null;
  principal_remark: string | null;
  created_at: string;
  updated_at: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type AssessmentObject = {
  uuid: string;
  subject: string;
  assignment: number;
  assessment: number;
  examination: number;
  overall: number;
};

export default function ReportPage() {
  const { uuid } = useParams();
  const { view, update } = useResult();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [assessments, setAssessments] = useState<AssessmentObject[]>([]);

  const fetchData = async () => {
    try {
      const response = await view(uuid as string);
      console.log(response);
      if (response.success) {
        setReport(response.data.result);
        setAssessments(response.data.result.assessments || []);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching the report data.', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateGrade = (overall: number): string => {
    if (overall >= 70) return 'A';
    if (overall >= 60) return 'B';
    if (overall >= 50) return 'C';
    if (overall >= 40) return 'D';
    return 'F';
  };

  const updateAssessment = (
    assessmentUuid: string,
    field: string,
    value: number
  ) => {
    setAssessments((prevAssessments) =>
      prevAssessments.map((assessment) => {
        if (assessment.uuid === assessmentUuid) {
          const updated = { ...assessment, [field]: value };
          updated.overall =
            updated.assignment + updated.assessment + updated.examination;
          return updated;
        }
        return assessment;
      })
    );
  };

  const updateRemark = (
    field: 'teacher_remark' | 'principal_remark',
    value: string
  ) => {
    setReport((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      setIsLoading(true);
      const response = await update(
        report!.uuid,
        {
          teacher_remark: report!.teacher_remark,
          principal_remark: report!.principal_remark,
          status: report!.status,
        },
        assessments
      );
      if (response.success) {
        setReport(response.data.result);
        setAssessments(response.data.result.assessments || []);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('An error occurred while saving the report.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getGradeBadge = (grade: string | null) => {
    const gradeColors: Record<string, string> = {
      'A+': 'bg-green-700 text-green-50',
      A: 'bg-green-700 text-green-50',
      'A-': 'bg-green-600 text-green-50',
      'B+': 'bg-blue-700 text-blue-50',
      B: 'bg-blue-700 text-blue-50',
      'B-': 'bg-blue-600 text-blue-50',
      'C+': 'bg-gray-600 text-gray-50',
      C: 'bg-gray-600 text-gray-50',
      D: 'bg-gray-500 text-gray-50',
      F: 'bg-red-700 text-red-50',
    };
    return gradeColors[grade || 'F'] || 'bg-gray-600 text-gray-50';
  };

  if (isLoading || !report) {
    return <IsLoading />;
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='flex justify-between items-center border-b pb-6'>
        <h1 className='text-2xl font-bold'>Student Report Card</h1>
        <div className='flex gap-2'>
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} className='gap-2'>
                <Edit className='h-4 w-4' />
                Edit Report
              </Button>
              <Link href={`/report/${report.uuid}`} target='_blank'>
                <Button className='gap-2'>
                  <Save className='h-4 w-4' />
                  <span>Generate Report</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant='outline'
                onClick={handleCancel}
                className='gap-2'
              >
                <X className='h-4 w-4' />
                Cancel
              </Button>
              <Button onClick={handleSave} className='gap-2'>
                <Save className='h-4 w-4' />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Student Information Card */}
      <Card className='shadow-none rounded-none'>
        <CardHeader className='border-b border-border'>
          <CardTitle className='text-lg'>Student Information</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={report.student.avatar || '/placeholder.svg'}
                alt={report.student.name}
              />
              <AvatarFallback>
                {report.student.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold'>{report.student.name}</h3>
              <p className='text-sm text-muted-foreground'>
                {report.student.reg_number}
              </p>
              <div className='flex items-center gap-4 mt-3'>
                <Badge variant='outline'>{report.class_name}</Badge>
                <Badge
                  className={
                    report.overall >= 50
                      ? 'bg-green-700 text-green-50'
                      : 'bg-red-700 text-red-50'
                  }
                >
                  Overall: {report.overall}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessments Table */}
      <Card className='shadow-none rounded-none'>
        <CardHeader className='border-b border-border'>
          <CardTitle className='text-lg'>Subject Assessments</CardTitle>
          {isEditing && (
            <p className='text-sm text-muted-foreground'>
              Edit scores below. Overall scores and grades will be calculated
              automatically.
            </p>
          )}
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='border-b border-border'>
                  <TableHead>Subject</TableHead>
                  <TableHead className='text-center'>Assignment</TableHead>
                  <TableHead className='text-center'>Assessment</TableHead>
                  <TableHead className='text-center'>Examination</TableHead>
                  <TableHead className='text-center'>Overall</TableHead>
                  <TableHead className='text-center'>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow
                    key={assessment.uuid}
                    className='border-b border-border'
                  >
                    <TableCell className='font-medium'>
                      {assessment.subject}
                    </TableCell>
                    <TableCell className='text-center'>
                      {isEditing ? (
                        <Input
                          type='number'
                          min='0'
                          max='5'
                          value={assessment.assignment}
                          onChange={(e) =>
                            updateAssessment(
                              assessment.uuid,
                              'assignment',
                              Number(e.target.value)
                            )
                          }
                          className='w-16 text-center'
                        />
                      ) : (
                        assessment.assignment
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {isEditing ? (
                        <Input
                          type='number'
                          min='0'
                          max='15'
                          value={assessment.assessment}
                          onChange={(e) =>
                            updateAssessment(
                              assessment.uuid,
                              'assessment',
                              Number(e.target.value)
                            )
                          }
                          className='w-16 text-center'
                        />
                      ) : (
                        assessment.assessment
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {isEditing ? (
                        <Input
                          type='number'
                          min='0'
                          max='80'
                          value={assessment.examination}
                          onChange={(e) =>
                            updateAssessment(
                              assessment.uuid,
                              'examination',
                              Number(e.target.value)
                            )
                          }
                          className='w-16 text-center'
                        />
                      ) : (
                        assessment.examination
                      )}
                    </TableCell>
                    <TableCell className='text-center font-bold'>
                      {assessment.overall}
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge
                        className={getGradeBadge(
                          calculateGrade(assessment.overall)
                        )}
                      >
                        {calculateGrade(assessment.overall)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary with Editable Remarks */}
      <Card className='shadow-none rounded-none'>
        <CardHeader className='border-b border-border'>
          <CardTitle className='text-lg'>Report Summary</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-6'>
            {/* Teacher's Remark */}
            <div>
              <Label className='text-sm font-medium mb-2 block'>
                Teacher Remark
              </Label>
              {isEditing ? (
                <Textarea
                  value={report.teacher_remark || ''}
                  onChange={(e) =>
                    updateRemark('teacher_remark', e.target.value)
                  }
                  placeholder="Enter teacher's remark..."
                  className='min-h-[80px]'
                />
              ) : (
                <div className='p-3 bg-muted border border-border'>
                  <p className='text-sm'>
                    {report.teacher_remark || 'No remark provided'}
                  </p>
                </div>
              )}
            </div>

            {/* Principal's Remark */}
            <div>
              <Label className='text-sm font-medium mb-2 block'>
                Principal Remark
              </Label>
              {isEditing ? (
                <Textarea
                  value={report.principal_remark || ''}
                  onChange={(e) =>
                    updateRemark('principal_remark', e.target.value)
                  }
                  placeholder="Enter principal's remark..."
                  className='min-h-[80px]'
                />
              ) : (
                <div className='p-3 bg-muted border border-border'>
                  <p className='text-sm'>
                    {report.principal_remark || 'No remark provided'}
                  </p>
                </div>
              )}
            </div>

            {/* Report Metadata */}
            <div className='grid grid-cols-2 gap-4 text-sm pt-4 border-t border-border'>
              <div>
                <Label className='text-sm font-medium'>Created Date</Label>
                <p className='mt-1'>
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className='text-sm font-medium'>Last Updated</Label>
                <p className='mt-1'>
                  {new Date(report.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Confirmation */}
      {isEditing && (
        <Card className='shadow-none rounded-none'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-foreground'>
              <Clock className='h-4 w-4' />
              <p className='text-sm font-medium'>
                You have unsaved changes. Remember to save your edits before
                leaving this page.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
