'use client';

import {useEffect, useState} from 'react';
import {Printer as Print} from 'lucide-react';

import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';

import {useResult} from '@/hooks/result';
import {useParams} from 'next/navigation';

interface StudentData {
    uuid: string;
    name: string;
    reg_number: string;
    avatar: string | null;
}

interface AssessmentObject {
    subject: string;
    assignment: number;
    assessment: number;
    examination: number;
    overall: number;
}

interface ResultData {
    class_name: string
    student: StudentData;
    assessments: AssessmentObject[];
    teacher_remark: string;
    principal_remark: string;
}

export default function TraditionalResultSheet() {
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [assessments, setAssessments] = useState<AssessmentObject[]>([]);
    const [showPrintView, setShowPrintView] = useState(false);
    const [loading, setLoading] = useState(true);
    const {view} = useResult();
    const {uuid} = useParams();

    const totalScores = assessments.reduce(
        (sum, subject) => sum + subject.overall,
        0
    );
    const average = (totalScores / assessments.length).toFixed(1);
    const handlePrint = () => {
        setShowPrintView(true);
        setTimeout(() => {
            window.print();
            setShowPrintView(false);
        }, 100);
    };

    const fetchData = async () => {
        try {
            const response = await view(uuid as string);
            if (response.success) {
                const result = response.data.result;
                console.log(result);
                setResultData(result);
                setAssessments(result.assessments || []);
                handlePrint()
            }
        } catch (error) {
            console.error('Error fetching result data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <LoadingPage/>;
    }

    if (!resultData) {
        return (
            <div className='min-h-screen bg-white p-6'>
                <p className='text-center text-foreground'>No result data available</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-white'>
            {/* Control Buttons - Hidden in print */}
            <div className='no-print p-4 mb-3 bg-white border-b border-gray-300'>
                <div className='max-w-4xl mx-auto flex justify-between items-center'>
                    <h1 className='text-xl font-bold text-foreground'>Report Sheet</h1>
                    <div className='flex gap-2'>
                        <Button onClick={handlePrint} className='gap-2'>
                            <Print className='h-4 w-4'/>
                            Print Result
                        </Button>
                    </div>
                </div>
            </div>

            <div className={`${showPrintView && 'flex'}`}>
                {/* Result Sheet - A4 Format */}
                <div className={`result-sheet ${showPrintView && 'print-view'}`}>
                    <div className='page-content'>
                        {/* Header */}
                        <div className='text-center mb-6'>
                            <h1 className='text-xl font-bold tracking-wider'>RESULT</h1>
                        </div>

                        {/* Student Information */}
                        <div className='student-info mb-6'>
                            <div className='info-row'>
                                <div className='info-field'>
                                    <span className='label'>NAME:</span>
                                    <span className='underline-field'>{resultData.student.name}</span>
                                </div>
                                <div className='info-field'>
                                    <span className='label'>SESSION:</span>
                                    <span className='underline-field'> </span>
                                </div>
                            </div>

                            <div className='info-row'>
                                <div className='info-field'>
                                    <span className='label'>CLASS:</span>
                                    <span className='underline-field'>{resultData.class_name}</span>
                                </div>
                                <div className='info-field'>
                                    <span className='label'>TERM:</span>
                                    <span className='underline-field'> </span>
                                </div>
                            </div>

                            <div className='info-row'>
                                <div className='info-field'>
                                    <span className='label'>POSITION:</span>
                                    <span className='underline-field'> </span>
                                </div>
                                <div className='info-field'>
                                    <span className='label'>NO. OF STUDENTS:</span>
                                    <span className='underline-field'> </span>
                                </div>
                            </div>

                            <div className='info-row'>
                                <div className='info-field'>
                                    <span className='label'>CLOSING DATE:</span>
                                    <span className='underline-field'> </span>
                                </div>
                                <div className='info-field'>
                                    <span className='label'>RESUMPTION DATE:</span>
                                    <span className='underline-field'> </span>
                                </div>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className='results-table mb-6'>
                            <table className='w-full border-collapse border-2 border-black'>
                                <thead>
                                <tr className='bg-gray-200'>
                                    <th className='border border-black p-2 text-left font-bold'>
                                        SUBJECTS
                                    </th>
                                    <th className='border border-black p-1 text-center font-bold text-xs'>
                                        ASSIGNMENT
                                    </th>
                                    <th className='border border-black p-1 text-center font-bold text-xs'>
                                        ASSESMENT
                                    </th>
                                    <th className='border border-black p-1 text-center font-bold text-xs'>
                                        EXAMINATION
                                    </th>
                                    <th className='border border-black p-1 text-center font-bold text-xs'>
                                        TOTAL
                                    </th>
                                    <th className='border border-black p-1 text-center font-bold text-xs'>
                                        GRADE
                                    </th>
                                    <th className='border border-black p-1 text-center font-bold text-xs'>
                                        REMARK
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {assessments.map((assessment, index) => (
                                    <tr key={index}>
                                        <td className='border border-black p-2 font-semibold'>
                                            {assessment.subject}
                                        </td>
                                        <td className='border border-black p-1 text-center'>
                                            {assessment.assignment}
                                        </td>
                                        <td className='border border-black p-1 text-center'>
                                            {assessment.assessment}
                                        </td>
                                        <td className='border border-black p-1 text-center'>
                                            {assessment.examination}
                                        </td>
                                        <td className='border border-black p-1 text-center font-bold'>
                                            {assessment.overall}
                                        </td>
                                        <td className='border border-black p-1 text-center font-bold'>
                                            {' '}
                                        </td>
                                        <td className='border border-black p-1 text-center text-xs'>
                                            {' '}
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty rows */}
                                {Array.from({
                                    length: Math.max(0, 15 - assessments.length),
                                }).map((_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td className='border border-black p-2'>&nbsp;</td>
                                        <td className='border border-black p-1'>&nbsp;</td>
                                        <td className='border border-black p-1'>&nbsp;</td>
                                        <td className='border border-black p-1'>&nbsp;</td>
                                        <td className='border border-black p-1'>&nbsp;</td>
                                        <td className='border border-black p-1'>&nbsp;</td>
                                        <td className='border border-black p-1'>&nbsp;</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Section */}
                        <div className='summary-section mb-2'>
                            <div className='flex justify-between items-start'>
                                <div className='flex justify-between item-center gap-2'>
                                    <h3 className='text-md font-bold mb-2'>TOTAL SCORES</h3>
                                    <div className='text-md font-bold'>{totalScores}</div>
                                </div>
                                <div className='flex justify-between item-center gap-2'>
                                    <h3 className='text-md font-bold mb-2'>AVERAGE:</h3>
                                    <div className='text-md font-bold'>{average}</div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className='bottom-section text-xs'>
                            <div className='flex justify-between'>
                                {/* Affective Skills */}
                                <div className='affective-skills'>
                                    <h3 className='font-bold mb-2'>AFFECTIVE SKILLS</h3>
                                    <table className='border-collapse border border-black'>
                                        <tbody>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold'>
                                                PUNCTUALITY
                                            </td>
                                            <td className='border border-black p-1 text-center w-12'>
                                                {' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold'>
                                                POLITENESS
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                {' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold'>
                                                NEATNESS
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                {' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold'>
                                                HONESTY
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                {' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold italic'>
                                                LEADERSHIP SKILLS
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                {' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold italic'>
                                                ATTENTIVENESS
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                {' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 font-semibold italic'>
                                                COOPERATION
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                {' '}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Grading System */}
                                <div className='grading-system'>
                                    <h3 className='font-bold mb-2'>GRADING SYSTEM</h3>
                                    <table className='border-collapse border border-black w-full'>
                                        <tbody>
                                        <tr>
                                            <td className='border border-black p-1 text-center font-bold'>
                                                A
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                70-100
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 text-center font-bold'>
                                                B
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                60-69
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 text-center font-bold'>
                                                C
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                50-59
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 text-center font-bold'>
                                                D
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                40-49
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black p-1 text-center font-bold'>
                                                E
                                            </td>
                                            <td className='border border-black p-1 text-center'>
                                                0-39
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Remarks Section */}
                        <div className='mt-3'>
                            <div className='mb-4'>
                                <div className='flex items-center'>
                                    <span className='font-bold mr-2'>TEACHER REMARK:</span>
                                    <div className='flex-1 border-b border-black'>
                                        {resultData.teacher_remark}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-3'>
                                <div className='flex items-center'>
                                    <span className='font-bold mr-2'>PRINCIPAL REMARK:</span>
                                    <div className='flex-1 border-b border-black'>
                                        {resultData.principal_remark}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-5'>
                                <div className='flex justify-end'>
                                    <div className='flex items-center'>
                                        <span className='font-bold mr-2'>SIGN:</span>
                                        <div className='w-48 border-b border-black pb-1'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .result-sheet {
                    max-width: 210mm;
                    margin: 0 auto;
                    background: white;
                    padding: 20mm;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .page-content {
                    font-family: 'Times New Roman', serif;
                    font-size: 12px;
                    line-height: 1.2;
                }

                .student-info {
                    font-size: 14px;
                    font-weight: bold;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .info-field {
                    display: flex;
                    align-items: center;
                    width: 48%;
                }

                .label {
                    font-weight: bold;
                    margin-right: 8px;
                }

                .underline-field {
                    flex: 1;
                    border-bottom: 1px solid black;
                    padding-bottom: 2px;
                    text-align: center;
                }

                .results-table table {
                    font-size: 11px;
                }

                @media print {
                    .no-print {
                        display: none !important;
                    }

                    .result-sheet {
                        box-shadow: none;
                        margin: 0;
                        padding: 15mm;
                        max-width: none;
                        width: 100%;
                    }

                    .page-content {
                        font-size: 11px;
                    }

                    .student-info {
                        font-size: 12px;
                    }

                    body {
                        margin: 0;
                        padding: 0;
                    }

                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
}
