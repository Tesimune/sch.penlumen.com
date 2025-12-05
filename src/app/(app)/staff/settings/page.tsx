'use client';

import {useEffect, useState} from 'react';

import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {motion} from 'framer-motion';
import {Award, MenuSquareIcon, Plus, Search} from 'lucide-react';

import {toast} from 'sonner';
import {useGrade} from '@/hooks/grade';
import LoadingPage from '@/components/loading-page';

interface Grade {
    uuid: string;
    score: number;
    grade: string;
    remark: string;
    description: string;
    created_at: string;
}

export default function GradesPage() {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editUUID, setEditUUID] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        score: 0,
        grade: '',
        remark: '',
        description: '',
    });

    const {index, create, update, remove} = useGrade();

    const fetchData = async () => {
        setIsLoading(true);
        const response = await index();
        try {
            if (response.success) {
                setGrades(response.data.grades);
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredGrades = grades.filter(
        (grade) =>
            grade.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grade.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grade.score.toString().includes(searchQuery)
    );

    const getBadgeVariant = (grade: string) => {
        switch (grade) {
            case 'A':
                return 'outline';
            case 'B':
                return 'default';
            case 'C':
                return 'secondary';
            case 'D':
                return 'destructive';
            case 'E':
                return 'destructive';
            case 'F':
                return 'destructive';
            default:
                return 'destructive';
        }
    };

    const handleReset = () => {
        setFormData({
            score: 0,
            grade: '',
            remark: '',
            description: '',
        });
        setEditUUID(null);
        setIsAddDialogOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response: any = {success: false, message: '', data: null};
            if (editUUID) {
                response = await update(editUUID, formData);
            } else {
                response = await create(formData);
            }
            if (response.success) {
                fetchData();
                handleReset();
                setIsAddDialogOpen(false);
            } else {
                toast.error(response.message || 'Something went wrong');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (grade: Grade) => {
        setIsAddDialogOpen(false);
        setEditUUID(grade.uuid);
        setFormData({
            score: grade.score,
            grade: grade.grade,
            remark: grade.remark,
            description: grade.description,
        });
        // Small delay to prevent dialog conflicts
        setTimeout(() => {
            setIsAddDialogOpen(true);
        }, 10);
    };

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this grade?')) {
            setIsLoading(true);
            try {
                const response = await remove(uuid);
                if (response.success) {
                    fetchData();
                    toast.success('Grade deleted successfully');
                } else {
                    toast.error(response.message || 'Something went wrong');
                }
            } catch (error: any) {
                toast.error(error.message || 'Something went wrong');
            } finally {
                setIsLoading(false);
            }
        }
    };


    if (isLoading) {
        return <LoadingPage/>;
    }

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Grading System</h1>
                    <p className='text-muted-foreground'>
                        Manage grading criteria for student assessments
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger onClick={handleReset} asChild>
                            <Button size='sm' className='flex items-center rounded-none'>
                                <Plus className='h-4 w-4'/>
                                <span>Add Grade</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Grade</DialogTitle>
                                <DialogDescription>
                                    Create a new grade criteria for student assessment
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className='space-y-4 py-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='min-score'>Minimum Score</Label>
                                        <Input
                                            id='min-score'
                                            type='number'
                                            placeholder='e.g., 80'
                                            value={formData.score}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    score: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='grade'>Grade</Label>
                                        <Input
                                            id='grade'
                                            placeholder='e.g., A'
                                            value={formData.grade}
                                            onChange={(e) =>
                                                setFormData({...formData, grade: e.target.value})
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='remark'>Remark</Label>
                                    <Input
                                        id='remark'
                                        placeholder='e.g., Excellent'
                                        value={formData.remark}
                                        onChange={(e) =>
                                            setFormData({...formData, remark: e.target.value})
                                        }
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='description'>Description (Optional)</Label>
                                    <Textarea
                                        id='description'
                                        placeholder='Additional details about this grade'
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({...formData, description: e.target.value})
                                        }
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => setIsAddDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Save Grade</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Card className='shadow-none rounded-none'>
                    <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                        <div className='relative w-full'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
                            <Input
                                placeholder={`Search grades...`}
                                className='pl-8'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Remark</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGrades.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className='h-24 text-center'>
                                            No grades found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredGrades.map((grade) => (
                                        <TableRow key={grade.uuid}>
                                            <TableCell className='font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    <Award className='h-4 w-4 text-primary'/>
                                                    <Badge variant={getBadgeVariant(grade.grade)}>
                                                        {grade.grade}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>{grade.description}</TableCell>
                                            <TableCell>{grade.remark}</TableCell>
                                            <TableCell>{grade.created_at}</TableCell>
                                            <TableCell className='text-right'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant='ghost' size='sm'>
                                                            <MenuSquareIcon/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem onClick={() => handleEdit(grade)}>
                                                            Edit Grade
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(grade.uuid)}
                                                            className='text-destructive'
                                                        >
                                                            Delete Grade
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
