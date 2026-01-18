'use client';

import {useEffect, useState} from 'react';
import {Printer as Print, User} from 'lucide-react';
import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';
import {useResult} from '@/hooks/result';
import {useParams} from 'next/navigation';

// ... (Interfaces and Constants remain the same as your original code)
interface GradingScale {
    grade: string;
    score: number;
    remark: string;
}

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
    grade?: string;
    remark?: string;
}

interface CalendarData {
    session: string;
    term: string;
    close_date: string;
    open_date: string;
}

interface ResultSummary {
    position: string | number;
    total_students: number;
}

interface ResultData {
    result: {
        student: StudentData;
        calendar: CalendarData;
        class_name: string;
        teacher_remark: string;
        principal_remark: string;
    };
    summary: ResultSummary;
    assessments: AssessmentObject[];
    grading_system?: GradingScale[];
}

const DEFAULT_GRADING_SYSTEM: GradingScale[] = [
    {grade: "A", score: 90, remark: "Excellent"},
    {grade: "B", score: 80, remark: "Very Good"},
    {grade: "C", score: 60, remark: "Good"},
    {grade: "D", score: 50, remark: "Fairly Good"},
    {grade: "F", score: 0, remark: "Failed"},
];

const getGradeAndRemark = (score: number, gradingSystem: GradingScale[]) => {
    const sorted = [...gradingSystem].sort((a, b) => b.score - a.score);
    for (const item of sorted) {
        if (score >= item.score) return {grade: item.grade, remark: item.remark};
    }
    return {grade: "F", remark: "Failed"};
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
};

const school_logo = process.env.NEXT_PUBLIC_APP_LOGO;
const school_name = process.env.NEXT_PUBLIC_APP_FULL_NAME;
const school_address = process.env.NEXT_PUBLIC_APP_ADDRESS;

export default function TraditionalResultSheet() {
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [assessments, setAssessments] = useState<AssessmentObject[]>([]);
    const [shouldPrint, setShouldPrint] = useState(false);
    const [loading, setLoading] = useState(true);
    const {view} = useResult();
    const {uuid} = useParams();

    const totalScores = assessments.reduce((sum, subject) => sum + subject.overall, 0);
    const average = assessments.length > 0 ? (totalScores / assessments.length).toFixed(1) : 0;

    const handlePrint = () => {
        window.print();
    };

    const gradingSystem = resultData?.grading_system || DEFAULT_GRADING_SYSTEM;

    const fetchData = async () => {
        try {
            const response = await view(uuid as string);
            if (response.success) {
                setResultData(response.data);
                setAssessments(response.data.assessments || []);
                setShouldPrint(true);
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


    if (loading) return <LoadingPage/>;
    if (!resultData) return <div className='p-6 text-center'>No result data available</div>;

    return (
        <div className='min-h-screen bg-gray-100 pb-10'>
            {/* Control Buttons */}
            <div className='no-print p-4 mb-3 bg-white border-b sticky top-0 z-10'>
                <div className='max-w-4xl mx-auto flex justify-between items-center'>
                    <h1 className='md:text-xl font-bold'>Report Card Preview</h1>
                    <Button onClick={handlePrint} className='gap-2'>
                        <Print className='h-4 w-4'/> Print Result
                    </Button>
                </div>
            </div>

            <div className='overflow-auto'>
                {/* Result Sheet - A4 Format */}
                <div className="result-sheet">
                    <div className='page-content'>

                        {/* Header: School Info */}
                        <div className='flex items-center justify-between border-b-2 border-black pb-1 mb-1'>
                            <img src={school_logo} alt='school logo' className="h-20 w-20 object-contain"/>
                            <div className='text-center flex-1 px-4'>
                                <h1 className='text-2xl font-black uppercase leading-tight'>{school_name}</h1>
                                <p className='text-xs uppercase font-bold'>{school_address}</p>
                                <div
                                    className='inline-block bg-black text-white px-4 py-1 mt-2 text-sm font-bold tracking-widest'>
                                    STUDENT PROGRESS REPORT
                                </div>
                            </div>
                            <div
                                className="h-20 w-20 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                {resultData.result.student.avatar ? (
                                    <img src={resultData.result.student.avatar} alt="student"
                                         className="h-full w-full object-cover"/>
                                ) : (
                                    <User className="text-gray-300 h-10 w-10"/>
                                )}
                            </div>
                        </div>

                        {/* Student Info Grid */}
                        <div className='grid grid-cols-3 gap-y-2 gap-x-6 mb-1 text-[13px]'>
                            <div className='flex gap-2 border-b border-gray-400 pb-1'>
                                <span className='font-bold uppercase whitespace-nowrap'>Name:</span>
                                <span className='truncate'>{resultData.result.student.name}</span>
                            </div>
                            <div className='flex gap-2 border-b border-gray-400 pb-1'>
                                <span className='font-bold uppercase whitespace-nowrap'>Reg No:</span>
                                <span>{resultData.result.student.reg_number}</span>
                            </div>
                            <div className='flex gap-2 border-b border-gray-400 pb-1'>
                                <span className='font-bold uppercase whitespace-nowrap'>Class:</span>
                                <span>{resultData.result.class_name}</span>
                            </div>
                            <div className='flex gap-2 border-b border-gray-400 pb-1'>
                                <span className='font-bold uppercase whitespace-nowrap'>Session:</span>
                                <span>{resultData.result.calendar?.session}</span>
                            </div>
                            <div className='flex gap-2 border-b border-gray-400 pb-1'>
                                <span className='font-bold uppercase whitespace-nowrap'>Term:</span>
                                <span>{resultData.result.calendar?.term}</span>
                            </div>
                            <div className='flex gap-2 border-b border-gray-400 pb-1'>
                                <span className='font-bold uppercase whitespace-nowrap'>Position:</span>
                                <span
                                    className="font-bold">{resultData.summary.position} / {resultData.summary.total_students}</span>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className='results-table mb-1'>
                            <table className='w-full border-collapse border-2 border-black'>
                                <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-black p-1.5 text-left font-bold text-xs'>SUBJECTS</th>
                                    <th className='border border-black p-1 text-center font-bold text-[10px] w-16'>ASSIGN.</th>
                                    <th className='border border-black p-1 text-center font-bold text-[10px] w-16'>TEST</th>
                                    <th className='border border-black p-1 text-center font-bold text-[10px] w-16'>EXAM</th>
                                    <th className='border border-black p-1 text-center font-bold text-[10px] w-16'>TOTAL</th>
                                    <th className='border border-black p-1 text-center font-bold text-[10px] w-12'>GRADE</th>
                                    <th className='border border-black p-1 text-center font-bold text-[10px] w-24'>REMARK</th>
                                </tr>
                                </thead>
                                <tbody>
                                {assessments.map((assessment, index) => (
                                    <tr key={index} className="h-7">
                                        <td className='border border-black px-2 font-bold text-xs uppercase'>{assessment.subject}</td>
                                        <td className='border border-black text-center text-xs'>{assessment.assignment}</td>
                                        <td className='border border-black text-center text-xs'>{assessment.assessment}</td>
                                        <td className='border border-black text-center text-xs'>{assessment.examination}</td>
                                        <td className='border border-black text-center font-bold text-xs'>{assessment.overall}</td>
                                        <td className='border border-black text-center font-bold text-xs'>
                                            {assessment.grade || getGradeAndRemark(assessment.overall, gradingSystem).grade}
                                        </td>
                                        <td className='border border-black text-center text-[10px] uppercase'>{assessment.remark}</td>
                                    </tr>
                                ))}
                                {/* Dynamic Empty rows to fill space but prevent overflow */}
                                {Array.from({length: Math.max(0, 12 - assessments.length)}).map((_, index) => (
                                    <tr key={`empty-${index}`} className="h-7">
                                        <td className='border border-black'>&nbsp;</td>
                                        <td className='border border-black'>&nbsp;</td>
                                        <td className='border border-black'>&nbsp;</td>
                                        <td className='border border-black'>&nbsp;</td>
                                        <td className='border border-black'>&nbsp;</td>
                                        <td className='border border-black'>&nbsp;</td>
                                        <td className='border border-black'>&nbsp;</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="bg-gray-50">
                                    <td className="border border-black px-2 font-bold text-xs">AGGREGATE / AVERAGE</td>
                                    <td colSpan={3} className="border border-black"></td>
                                    <td className="border border-black text-center font-bold text-sm bg-gray-200">{totalScores}</td>
                                    <td colSpan={2}
                                        className="border border-black text-center font-bold text-sm bg-gray-200">{average}%
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className='grid grid-cols-2 gap-4 mb-1'>
                            {/* Affective Skills */}
                            <div>
                                <h3 className='font-bold text-xs mb-1 uppercase bg-gray-200 px-1 border border-black'>Affective
                                    Domain</h3>
                                <table className='w-full border-collapse border border-black text-[10px]'>
                                    <tbody>
                                    {['Punctuality', 'Neatness', 'Politeness', 'Honesty', 'Leadership'].map(skill => (
                                        <tr key={skill}>
                                            <td className='border border-black px-1 font-bold uppercase'>{skill}</td>
                                            <td className='border border-black w-10 text-center'>{' '}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Grading Key */}
                            <div>
                                <h3 className='font-bold text-xs mb-1 uppercase bg-gray-200 px-1 border border-black'>Grading
                                    Key</h3>
                                <table className='w-full border-collapse border border-black text-[10px]'>
                                    <tbody>
                                    <tr className='flex flex-wrap p-1 gap-x-4'>
                                        {gradingSystem.map((item, index) => (
                                            <td key={index} className="whitespace-nowrap">
                                                <span className="font-bold">{item.grade}</span>: {item.score}+
                                                ({item.remark})
                                            </td>
                                        ))}
                                    </tr>
                                    </tbody>
                                </table>
                                <p className="my-2 text-[10px] uppercase italic">
                                    <span className="font-bold">Note:</span> Vacation commences on <span
                                    className="font-bold">{formatDate(resultData.result.calendar?.close_date)}</span> and
                                    academic activities resume on <span
                                    className="font-bold">{formatDate(resultData.result.calendar?.open_date)}.</span>
                                </p>
                            </div>
                        </div>

                        {/* Remarks Section */}
                        <div className='space-y-3 text-[12px]'>
                            <div className='flex items-end gap-2'>
                                <span
                                    className='font-bold whitespace-nowrap uppercase'>Class Teacher&apos;s Remark:</span>
                                <div
                                    className='flex-1 border-b border-black italic px-2'>{resultData.result.teacher_remark}</div>
                            </div>
                            <div className='flex items-end gap-2'>
                                <span className='font-bold whitespace-nowrap uppercase'>Principal&apos;s Remark:</span>
                                <div
                                    className='flex-1 border-b border-black italic px-2'>{resultData.result.principal_remark}</div>
                            </div>

                            {/*<div className='flex justify-between items-end pt-1'>*/}
                            {/*    <div className="text-center">*/}
                            {/*        <div className="w-32 border-b border-black"></div>*/}
                            {/*        <span className="text-[10px] uppercase font-bold">Class Teacher Sign</span>*/}
                            {/*    </div>*/}
                            {/*    <div className="text-center">*/}
                            {/*        <div className="w-32 border-b border-black"></div>*/}
                            {/*        <span className="text-[10px] uppercase font-bold">Principal Sign & Stamp</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .result-sheet {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    background: white;
                    padding: 15mm;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .page-content {
                    font-family: 'Arial', sans-serif;
                }

                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .result-sheet {
                        width: 100%;
                        height: 100vh;
                        margin: 0;
                        padding: 10mm;
                        box-shadow: none;
                        overflow: hidden; /* Critical: prevents second page */
                    }
                }
            `}</style>
        </div>
    );
}