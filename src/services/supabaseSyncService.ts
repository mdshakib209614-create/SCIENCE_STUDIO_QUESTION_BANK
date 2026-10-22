import { supabase, uploadBase64ToSupabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  Student, 
  Teacher, 
  InstitutionProfile, 
  RoutineItem, 
  StudentResult, 
  Notice, 
  FeeTransaction, 
  QuestionItem, 
  ExamPaperConfig, 
  SavedCertificate,
  MCQQuestion,
  CQQuestion,
  ShortQuestion
} from '../types';
import { SavedAdmitCard } from '../components/ExamView';

export interface SyncProgress {
  step: string;
  percent: number;
  completed: boolean;
  error?: string;
  details?: string;
}

/**
 * Upload an image (base64 or blob URL) to Supabase Storage if needed
 */
async function uploadAssetIfBase64(
  bucket: 'institution-assets' | 'student-photos' | 'staff-photos' | 'question-assets',
  path: string,
  urlOrBase64?: string
): Promise<string | undefined> {
  if (!urlOrBase64) return undefined;
  // If it's already a hosted URL on supabase or remote web, keep it
  if (urlOrBase64.startsWith('http://') || urlOrBase64.startsWith('https://')) {
    return urlOrBase64;
  }
  // If it's a base64 data URI, upload to Supabase storage bucket
  if (urlOrBase64.startsWith('data:')) {
    const uploadedUrl = await uploadBase64ToSupabase(bucket, path, urlOrBase64);
    return uploadedUrl || urlOrBase64;
  }
  return urlOrBase64;
}

/**
 * 1. Sync Institution Profile, Logos, Signatures & Watermark to Supabase
 */
export async function syncInstitutionToSupabase(
  institution: InstitutionProfile,
  extraAssets?: {
    principalSig?: string;
    controllerSig?: string;
    classTeacherSig?: string;
    sealUrl?: string;
    watermarkImage?: string;
    watermarkOpacity?: number;
    watermarkSize?: number;
    showWatermark?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    // Upload files to 'institution-assets' bucket if base64
    const logoUrl = await uploadAssetIfBase64(
      'institution-assets',
      `logos/institution_logo_${Date.now()}.png`,
      institution.logoUrl
    );

    const sealUrl = await uploadAssetIfBase64(
      'institution-assets',
      `seals/institution_seal_${Date.now()}.png`,
      extraAssets?.sealUrl || institution.sealUrl
    );

    const principalSigUrl = await uploadAssetIfBase64(
      'institution-assets',
      `signatures/principal_sig_${Date.now()}.png`,
      extraAssets?.principalSig
    );

    const controllerSigUrl = await uploadAssetIfBase64(
      'institution-assets',
      `signatures/controller_sig_${Date.now()}.png`,
      extraAssets?.controllerSig
    );

    const classTeacherSigUrl = await uploadAssetIfBase64(
      'institution-assets',
      `signatures/class_teacher_sig_${Date.now()}.png`,
      extraAssets?.classTeacherSig
    );

    const watermarkImgUrl = await uploadAssetIfBase64(
      'institution-assets',
      `watermarks/watermark_logo_${Date.now()}.png`,
      extraAssets?.watermarkImage
    );

    const payload = {
      id: '00000000-0000-0000-0000-000000000001',
      name_bn: institution.nameBn,
      name_en: institution.nameEn,
      slogan: institution.slogan || 'জ্ঞানেই শক্তি, শিক্ষাই মুক্তি',
      established: institution.established,
      village: institution.village,
      post_office: institution.postOffice,
      upazila: institution.upazila,
      district: institution.district,
      emis_no: institution.emisNo,
      ipemis_code: institution.ipemisCode,
      eiin: institution.eiin,
      phone: institution.phone,
      email: institution.email,
      website: institution.website,
      board_name: institution.boardName,
      headmaster_name: institution.headmasterName,
      headmaster_title: institution.headmasterTitle,
      logo_url: logoUrl || institution.logoUrl,
      seal_url: sealUrl || institution.sealUrl,
      principal_signature_url: principalSigUrl,
      controller_signature_url: controllerSigUrl,
      class_teacher_signature_url: classTeacherSigUrl,
      watermark_enabled: extraAssets?.showWatermark ?? true,
      watermark_image_url: watermarkImgUrl,
      watermark_opacity: extraAssets?.watermarkOpacity ?? 0.08,
      watermark_size: extraAssets?.watermarkSize ?? 160,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('institutions')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Error syncing institution:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Sync Students to Supabase (batches of 50)
 */
export async function syncStudentsToSupabase(
  students: Student[],
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const batchSize = 50;
    let synced = 0;

    for (let i = 0; i < students.length; i += batchSize) {
      const chunk = students.slice(i, i + batchSize);
      
      const payload = await Promise.all(chunk.map(async (s) => {
        const photoUrl = s.photoUrl?.startsWith('data:') 
          ? await uploadAssetIfBase64('student-photos', `student_${s.id || s.roll}_${Date.now()}.jpg`, s.photoUrl)
          : s.photoUrl;

        return {
          id: s.id || `st-${s.roll}-${Date.now()}`,
          roll: String(s.roll),
          name_bn: s.nameBn,
          name_en: s.nameEn || '',
          class: s.class,
          section: s.section || 'ক',
          shift: s.shift || 'সকাল',
          gender: s.gender || 'ছেলে',
          father_name: s.fatherName || '',
          mother_name: s.motherName || '',
          phone: s.phone || '',
          birth_date: s.birthDate || '',
          birth_date_words: s.birthDateWords || '',
          nid_or_birth_reg: s.nidOrBirthReg || '',
          blood_group: s.bloodGroup || '',
          address: s.address || '',
          village: s.village || '',
          post_office: s.postOffice || '',
          upazila: s.upazila || '',
          district: s.district || '',
          admission_date: s.admissionDate || '',
          previous_school: s.previousSchool || '',
          status: s.status || 'সক্রিয়',
          photo_url: photoUrl || null,
          monthly_fee: s.monthlyFee || 800,
          fee_status: s.feeStatus || 'পরিশোধিত',
          updated_at: new Date().toISOString()
        };
      }));

      const { error } = await supabase
        .from('students')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      synced += chunk.length;
      if (onProgress) onProgress(Math.round((synced / students.length) * 100));
    }

    return { success: true, count: synced };
  } catch (err: any) {
    console.error('Error syncing students:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 3. Sync Teachers to Supabase
 */
export async function syncTeachersToSupabase(
  teachers: Teacher[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const payload = await Promise.all(teachers.map(async (t) => {
      const photoUrl = t.photoUrl?.startsWith('data:')
        ? await uploadAssetIfBase64('staff-photos', `teacher_${t.id}_${Date.now()}.jpg`, t.photoUrl)
        : t.photoUrl;

      return {
        id: t.id || `tc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name_bn: t.nameBn,
        name_en: t.nameEn || '',
        designation: t.designation,
        qualification: t.qualification || '',
        subject: t.subject || '',
        phone: t.phone || '',
        email: t.email || '',
        join_date: t.joinDate || '',
        blood_group: t.bloodGroup || '',
        address: t.address || '',
        status: t.status || 'কর্মরত',
        photo_url: photoUrl || null,
        updated_at: new Date().toISOString()
      };
    }));

    const { error } = await supabase
      .from('teachers')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: teachers.length };
  } catch (err: any) {
    console.error('Error syncing teachers:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 4. Sync Question Bank to Supabase (in batches of 100 with live progress)
 */
export async function syncQuestionsToSupabase(
  questions: QuestionItem[],
  onProgress?: (progress: number, count: number) => void
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const batchSize = 100;
    let synced = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const chunk = questions.slice(i, i + batchSize);

      const payload = chunk.map((q) => {
        const base = {
          id: q.id || `q-${Math.random().toString(36).substring(2, 9)}`,
          type: q.type,
          subject: q.subject || 'সাধারণ',
          chapter: q.chapter || 'সাধারণ',
          topic: q.topic || null,
          grammar_topic: q.grammarTopic || null,
          target_class: q.targetClass || null,
          part: q.part || null,
          item_number: q.itemNumber ? String(q.itemNumber) : null,
          marks: q.marks || 1,
          marks_distribution: q.marksDistribution || null,
          board_info: q.boardInfo || null,
          importance: q.importance || 'standard',
          updated_at: new Date().toISOString()
        };

        if (q.type === 'mcq') {
          const mcq = q as MCQQuestion;
          return {
            ...base,
            question: mcq.question,
            options: mcq.options || ['ক', 'খ', 'গ', 'ঘ'],
            correct_option: mcq.correctOption ?? 0,
            explanation: mcq.explanation || null
          };
        } else if (q.type === 'cq') {
          const cq = q as CQQuestion;
          return {
            ...base,
            stimulus: cq.stimulus || '',
            sub_questions: cq.subQuestions || []
          };
        } else {
          const sq = q as ShortQuestion;
          return {
            ...base,
            question: sq.question,
            answer: sq.answer || null,
            clues_box: sq.cluesBox || null
          };
        }
      });

      const { error } = await supabase
        .from('questions')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      synced += chunk.length;
      if (onProgress) {
        onProgress(Math.round((synced / questions.length) * 100), synced);
      }
    }

    return { success: true, count: synced };
  } catch (err: any) {
    console.error('Error syncing questions:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 5. Sync Saved Exam Papers Archive to Supabase
 */
export async function syncSavedExamPapersToSupabase(
  papers: ExamPaperConfig[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };
  if (papers.length === 0) return { success: true, count: 0 };

  try {
    const payload = papers.map((p) => ({
      id: p.id || `exam-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      paper_title: p.paperTitle || p.examTitle,
      coaching_name: p.coachingName,
      sub_title: p.subTitle || null,
      exam_title: p.examTitle,
      subject: p.subject,
      subject_code: p.subjectCode || null,
      class: p.class,
      section: p.section || null,
      duration: p.duration,
      total_marks: p.totalMarks || 100,
      format: p.format || 'k_kh_g',
      pattern: p.pattern || 'k_kh_g',
      page_layout: p.pageLayout || 'two_column',
      paper_layout_mode: p.paperLayoutMode || 'landscape_booklet',
      instructions: p.instructions || '',
      watermark: p.watermark || null,
      columns: p.columns || 2,
      show_answers_in_print: Boolean(p.showAnswersInPrint),
      selected_question_ids: p.selectedQuestionIds || [],
      custom_questions: p.customQuestions || [],
      section_k_questions: p.sectionKQuestions || [],
      section_kh_questions: p.sectionKhQuestions || [],
      section_g_questions: p.sectionGQuestions || [],
      date: p.date || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('saved_exam_papers')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: papers.length };
  } catch (err: any) {
    console.error('Error syncing saved papers:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 6. Sync Saved Admit Cards to Supabase
 */
export async function syncSavedAdmitCardsToSupabase(
  admitCards: SavedAdmitCard[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };
  if (admitCards.length === 0) return { success: true, count: 0 };

  try {
    const payload = admitCards.map((c) => ({
      id: c.id,
      student_id: c.studentId || null,
      student_name_bn: c.studentNameBn,
      student_name_en: c.studentNameEn || '',
      father_name: c.fatherName || '',
      mother_name: c.motherName || '',
      student_class: c.studentClass,
      section: c.section || 'ক',
      roll: c.roll,
      reg_no: c.regNo || '',
      group_name: c.group || 'বিজ্ঞান (Science)',
      exam_center: c.examCenter || 'প্রধান ক্যাম্পাস, কেন্দ্র-০১',
      photo_url: c.photoUrl || null,
      exam_term: c.examTerm
    }));

    const { error } = await supabase
      .from('saved_admit_cards')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: admitCards.length };
  } catch (err: any) {
    console.error('Error syncing admit cards:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 7. Sync Saved Certificates & Testimonials to Supabase
 */
export async function syncSavedCertificatesToSupabase(
  certificates: SavedCertificate[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };
  if (certificates.length === 0) return { success: true, count: 0 };

  try {
    const payload = certificates.map((cert) => ({
      id: cert.id,
      cert_type: cert.certType,
      theme: cert.theme || 'royal_gold',
      orientation: cert.orientation || 'landscape',
      cert_language: cert.certLanguage || 'bn',
      serial_no: cert.serialNo,
      issue_date: cert.issueDate,
      student_id: cert.studentId || null,
      student_name_bn: cert.studentNameBn,
      student_name_en: cert.studentNameEn || '',
      father_name: cert.fatherName || '',
      mother_name: cert.motherName || '',
      birth_date: cert.birthDate || '',
      birth_date_words: cert.birthDateWords || '',
      student_class: cert.studentClass || '',
      roll_no: cert.rollNo || '',
      reg_no: cert.regNo || '',
      session_year: cert.sessionYear || '',
      passing_year: cert.passingYear || '',
      board_name: cert.boardName || 'কুমিল্লা শিক্ষা বোর্ড',
      gpa_result: cert.gpaResult || '',
      merit_position: cert.meritPosition || '',
      achievement_title: cert.achievementTitle || '',
      conduct: cert.conduct || 'উত্তম ও প্রশংসনীয়',
      next_class: cert.nextClass || '',
      reason_for_leaving: cert.reasonForLeaving || ''
    }));

    const { error } = await supabase
      .from('saved_certificates')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: certificates.length };
  } catch (err: any) {
    console.error('Error syncing certificates:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 8. Sync Notices to Supabase
 */
export async function syncNoticesToSupabase(
  notices: Notice[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const payload = notices.map((n) => ({
      id: n.id || `not-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      title: n.title,
      content: n.content,
      date: n.date,
      is_emergency: Boolean(n.isEmergency),
      published_by: n.publishedBy || 'প্রধান শিক্ষক ও পরিচালক',
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('notices')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: notices.length };
  } catch (err: any) {
    console.error('Error syncing notices:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 9. Sync Exam Routines to Supabase
 */
export async function syncRoutinesToSupabase(
  routines: RoutineItem[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const payload = routines.map((r) => ({
      id: r.id || `rt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      class: '১০ম শ্রেণি',
      term: '৩য় প্রান্তিক মূল্যায়ন',
      academic_year: '২০২৬',
      date: r.date,
      day: r.day,
      subject: r.subject,
      time: r.time,
      shift: r.shift || 'সকাল',
      room_no: r.roomNo || '১০১',
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('exam_routines')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: routines.length };
  } catch (err: any) {
    console.error('Error syncing routines:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 10. Sync Student Results to Supabase
 */
export async function syncResultsToSupabase(
  results: StudentResult[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const payload = results.map((res) => ({
      id: `res-${res.studentId}-${res.term}`.replace(/\s+/g, '_'),
      student_id: res.studentId,
      student_name: res.studentName,
      roll: res.roll,
      class: res.class,
      section: res.section || 'ক',
      term: res.term,
      academic_year: res.academicYear || '২০২৬',
      attendance_days: res.attendanceDays || 0,
      total_working_days: res.totalWorkingDays || 0,
      subject_marks: res.subjectMarks || [],
      grand_total: res.grandTotal || 0,
      total_full_marks: res.totalFullMarks || 100,
      percentage: res.percentage || 0,
      overall_grade: res.overallGrade || 'A+',
      overall_gpa: res.overallGpa || 5.0,
      position: res.position || '',
      teacher_remarks: res.teacherRemarks || '',
      passed: res.passed ?? true,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('student_results')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: results.length };
  } catch (err: any) {
    console.error('Error syncing results:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * 11. Sync Fees to Supabase
 */
export async function syncFeesToSupabase(
  fees: FeeTransaction[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

  try {
    const payload = fees.map((f) => ({
      id: f.id || `fee-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      student_id: f.studentId,
      student_name: f.studentName,
      class: f.class,
      roll: f.roll,
      month: f.month,
      amount: f.amount,
      fee_type: f.feeType,
      payment_date: f.paymentDate,
      payment_method: f.paymentMethod || 'নগদ',
      status: f.status || 'পরিশোধিত'
    }));

    const { error } = await supabase
      .from('fee_transactions')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, count: fees.length };
  } catch (err: any) {
    console.error('Error syncing fees:', err);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * Master Sync: Uploads and synchronizes all application data and assets to Supabase
 */
export async function syncAllDataToSupabase(
  data: {
    institution: InstitutionProfile;
    students: Student[];
    teachers: Teacher[];
    questions: QuestionItem[];
    savedExamPapers: ExamPaperConfig[];
    savedAdmitCards?: SavedAdmitCard[];
    savedCertificates: SavedCertificate[];
    notices: Notice[];
    routines: RoutineItem[];
    results: StudentResult[];
    fees: FeeTransaction[];
    signatures?: {
      principalSig?: string;
      controllerSig?: string;
      classTeacherSig?: string;
      sealUrl?: string;
      watermarkImage?: string;
      watermarkOpacity?: number;
      watermarkSize?: number;
      showWatermark?: boolean;
    };
  },
  onProgress?: (progress: SyncProgress) => void
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'সুপাবেজ ক্রেডেনশিয়াল পাওয়া যায়নি। অনুগ্রহ করে প্রজেক্ট সেটিংস যাচাই করুন।' };
  }

  try {
    // 1. Institution Profile & Assets
    onProgress?.({ step: 'প্রতিষ্ঠান তথ্য ও লোগো বাকেটে আপলোড হচ্ছে...', percent: 10, completed: false });
    const instRes = await syncInstitutionToSupabase(data.institution, data.signatures);
    if (!instRes.success) throw new Error(instRes.error || 'Failed to sync institution');

    // 2. Students
    onProgress?.({ step: 'শিক্ষার্থী তালিকা সিঙ্ক হচ্ছে...', percent: 25, completed: false });
    const stuRes = await syncStudentsToSupabase(data.students);
    if (!stuRes.success) throw new Error(stuRes.error || 'Failed to sync students');

    // 3. Teachers & Staff
    onProgress?.({ step: 'শিক্ষক ও স্টাফ প্রোফাইল সিঙ্ক হচ্ছে...', percent: 40, completed: false });
    const teachRes = await syncTeachersToSupabase(data.teachers);
    if (!teachRes.success) throw new Error(teachRes.error || 'Failed to sync teachers');

    // 4. Question Bank
    onProgress?.({ step: `প্রশ্নব্যাংকের ${data.questions.length}টি প্রশ্ন সুপাবেজে ব্যাচ আকারে আপলোড হচ্ছে...`, percent: 55, completed: false });
    const qRes = await syncQuestionsToSupabase(data.questions, (p, c) => {
      onProgress?.({ 
        step: `প্রশ্নব্যাংক আপলোড হচ্ছে (${c}/${data.questions.length}টি)...`, 
        percent: 55 + Math.round((p / 100) * 20), 
        completed: false 
      });
    });
    if (!qRes.success) throw new Error(qRes.error || 'Failed to sync questions');

    // 5. Saved Exam Papers Archive
    onProgress?.({ step: 'সংরক্ষিত প্রশ্নপত্র আর্কাইভ সিঙ্ক হচ্ছে...', percent: 80, completed: false });
    await syncSavedExamPapersToSupabase(data.savedExamPapers);

    // 6. Saved Admit Cards Archive
    if (data.savedAdmitCards && data.savedAdmitCards.length > 0) {
      onProgress?.({ step: 'সংরক্ষিত প্রবেশপত্র (Admit Cards) সিঙ্ক হচ্ছে...', percent: 85, completed: false });
      await syncSavedAdmitCardsToSupabase(data.savedAdmitCards);
    }

    // 7. Saved Certificates & Testimonials
    onProgress?.({ step: 'সংরক্ষিত প্রশংসাপত্র ও সনদপত্র আর্কাইভ সিঙ্ক হচ্ছে...', percent: 90, completed: false });
    await syncSavedCertificatesToSupabase(data.savedCertificates);

    // 8. Notices, Routines, Results, Fees
    onProgress?.({ step: 'নোটিশ, পরীক্ষার রুটিন, ফলাফল ও ফি হিসাব সিঙ্ক হচ্ছে...', percent: 95, completed: false });
    await syncNoticesToSupabase(data.notices);
    await syncRoutinesToSupabase(data.routines);
    await syncResultsToSupabase(data.results);
    await syncFeesToSupabase(data.fees);

    onProgress?.({ 
      step: 'সকল ডাটা ও ফাইল সুপাবেজে সফলভাবে সিঙ্ক ও সংরক্ষিত হয়েছে!', 
      percent: 100, 
      completed: true,
      details: `${data.questions.length}টি প্রশ্ন, ${data.students.length} জন শিক্ষার্থী, ${data.teachers.length} জন শিক্ষক ও সকল আর্কাইভ সংরক্ষিত।`
    });

    return { success: true };
  } catch (err: any) {
    console.error('Master sync error:', err);
    onProgress?.({ 
      step: 'সিঙ্ক করার সময় ত্রুটি ঘটেছে', 
      percent: 0, 
      completed: false, 
      error: err.message || 'Unknown sync error' 
    });
    return { success: false, error: err.message };
  }
}
