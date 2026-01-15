'use client';

import {useEffect, useState} from 'react';
import {Clock, Edit, Printer as Print, Save, X} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import Link from 'next/link';
import {useResult} from '@/hooks/result';
import {useParams} from 'next/navigation';
import LoadingPage from '@/components/loading-page';

// --- Interfaces ---
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
    uuid: string;
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
    average: number;
}

interface ResultData {
    result: {
        uuid: string;
        student: StudentData;
        calendar: CalendarData;
        class_name: string;
        teacher_remark: string;
        principal_remark: string;
        status?: string;
    };
    summary: ResultSummary;
    assessments: AssessmentObject[];
    grading_system?: GradingScale[];
}

export default function ReportPage() {
    const {uuid} = useParams();
    const {view, update} = useResult();

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [reportData, setReportData] = useState<ResultData | null>(null);
    const [assessments, setAssessments] = useState<AssessmentObject[]>([]);

    const fetchData = async () => {
        try {
            const response = await view(uuid as string);
            if (response.success) {
                setReportData(response.data);
                console.log(response.data)
                setAssessments(response.data.assessments || []);
            }
        } catch (error) {
            console.error('Error fetching report', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Helpers ---
    const readableDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const getGradeColor = (grade: string) => {
        const colors: Record<string, string> = {
            'A': 'bg-emerald-300 text-emerald-900',
            'B': 'bg-blue-300 text-blue-900',
            'C': 'bg-yellow-300 text-yellow-900',
            'D': 'bg-orange-300 text-orange-900',
            'F': 'bg-red-300 text-red-900',
        };
        return colors[grade] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getGradeInfo = (overall: number) => {
        const system = reportData?.grading_system || [];
        const sorted = [...system].sort((a, b) => b.score - a.score);
        const found = sorted.find((g) => overall >= g.score);
        return {
            grade: found?.grade || 'F',
            remark: found?.remark || 'Failed'
        };
    };

    // --- Handlers ---
    const updateAssessment = (uuid: string, field: string, value: number) => {
        setAssessments(prev => prev.map(item => {
            if (item.uuid === uuid) {
                const updated = {...item, [field]: value};
                updated.overall = updated.assignment + updated.assessment + updated.examination;
                return updated;
            }
            return item;
        }));
    };

    const updateRemark = (field: 'teacher_remark' | 'principal_remark', value: string) => {
        setReportData(prev => prev ? {
            ...prev,
            result: {...prev.result, [field]: value}
        } : null);
    };

    const handleSave = async () => {
        if (!reportData) return;
        setIsLoading(true);
        try {
            const response = await update(
                reportData.result.uuid,
                {
                    teacher_remark: reportData.result.teacher_remark,
                    principal_remark: reportData.result.principal_remark,
                    status: 'PENDING',
                },
                assessments
            );
            if (response.success) {
                setIsEditing(false);
                fetchData();
            }
        } catch (error) {
            console.error('Save error', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !reportData) return <LoadingPage/>;

    const {result, summary} = reportData;

    return (
        <div className='space-y-6'>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Student Report Card</h1>
                    <p className="text-sm text-muted-foreground italic">Academic performance
                        for {result.calendar?.term}, {result.calendar?.session}</p>
                </div>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                                <Edit className="h-4 w-4"/> Edit Marks
                            </Button>
                            <Link href={`/report/${reportData.result.uuid}`} target="_blank">
                                <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                    <Print className="h-4 w-4"/> Print Result
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <X className="h-4 w-4 mr-1"/> Discard
                            </Button>
                            <Button onClick={handleSave}
                                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Save className="h-4 w-4"/> Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-3 shadow-sm overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-sm">
                                <AvatarImage src={result.student.avatar || ''}/>
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xl font-bold">
                                    {result.student.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-slate-900">{result.student.name}</h3>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{result.student.reg_number}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge variant="secondary"
                                           className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold">{result.class_name}</Badge>
                                    <Badge variant="outline"
                                           className="px-3 py-1">Position: {summary.position} of {summary.total_students}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Weighted
                            Average</p>
                        <h2 className={`text-4xl font-black mt-1 ${summary.average >= 50 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {summary.average}%
                        </h2>
                        <p className="text-[10px] mt-2 text-muted-foreground">
                            Next Term Resumes: <span
                            className="font-bold">{readableDate(result.calendar?.open_date)}</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* SUBJECTS TABLE */}
            <Card className="shadow-sm border-none bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-bold text-slate-700">SUBJECTS</TableHead>
                            <TableHead className="text-center w-24 font-bold text-slate-700">CA 1</TableHead>
                            <TableHead className="text-center w-24 font-bold text-slate-700">CA 2</TableHead>
                            <TableHead className="text-center w-24 font-bold text-slate-700">EXAM</TableHead>
                            <TableHead className="text-center w-24 font-bold text-slate-700">TOTAL</TableHead>
                            <TableHead className="text-center font-bold text-slate-700">PERFORMANCE</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assessments.map((a) => {
                            const {grade, remark} = getGradeInfo(a.overall);
                            const gradeStyle = getGradeColor(grade);

                            return (
                                <TableRow key={a.uuid} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell
                                        className="font-semibold text-slate-800 uppercase text-xs">{a.subject}</TableCell>
                                    {['assignment', 'assessment', 'examination'].map((field) => (
                                        <TableCell key={field} className="text-center">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    value={a[field as keyof AssessmentObject] as number}
                                                    onChange={(e) => updateAssessment(a.uuid, field, Number(e.target.value))}
                                                    className="w-16 mx-auto text-center h-8 focus:ring-emerald-500"
                                                />
                                            ) : (
                                                <span
                                                    className="text-slate-600">{a[field as keyof AssessmentObject] as number}</span>
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-center font-black text-slate-900">{a.overall}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline"
                                               className={`font-bold px-3 py-0.5 border-2 ${gradeStyle}`}>
                                            {grade}
                                        </Badge>
                                        <span
                                            className={`block text-[9px] mt-1 font-bold uppercase tracking-tighter ${grade === 'F' ? 'text-red-500' : 'text-slate-400'}`}>
                                            {remark}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* REMARKS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(['teacher_remark', 'principal_remark'] as const).map((field) => (
                    <Card key={field} className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2 bg-slate-50/50 border-b mb-4">
                            <CardTitle className="text-xs font-black uppercase text-slate-500 tracking-widest">
                                {field.replace('_', ' ')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Textarea
                                    value={result[field] || ''}
                                    onChange={(e) => updateRemark(field, e.target.value)}
                                    placeholder={`Enter official ${field.split('_')[0]} comment...`}
                                    className="min-h-[100px] border-slate-200 focus:border-emerald-500"
                                />
                            ) : (
                                <p className="text-sm italic text-slate-600 leading-relaxed">
                                    {result[field] || 'No official remark recorded for this period.'}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* UNSAVED CHANGES FLOATER */}
            {isEditing && (
                <div
                    className="fixed bottom-6 right-6 flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 px-6 border border-emerald-200 rounded-full shadow-lg animate-bounce">
                    <Clock className="h-5 w-5"/>
                    <p className="text-sm font-bold">You have unsaved changes!</p>
                </div>
            )}
        </div>
    );
}