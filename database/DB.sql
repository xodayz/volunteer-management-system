PGDMP      ,                }            sistema_voluntariado    17.5    17.5 /    <           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            =           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            >           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            ?           1262    16384    sistema_voluntariado    DATABASE     �   CREATE DATABASE sistema_voluntariado WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 $   DROP DATABASE sistema_voluntariado;
                     postgres    false                        3079    16389 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            @           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    16401    categorias_eventos    TABLE     -  CREATE TABLE public.categorias_eventos (
    id_categoria integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 &   DROP TABLE public.categorias_eventos;
       public         heap r       postgres    false            �            1259    16400 #   categorias_eventos_id_categoria_seq    SEQUENCE     �   CREATE SEQUENCE public.categorias_eventos_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.categorias_eventos_id_categoria_seq;
       public               postgres    false    219            A           0    0 #   categorias_eventos_id_categoria_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.categorias_eventos_id_categoria_seq OWNED BY public.categorias_eventos.id_categoria;
          public               postgres    false    218            �            1259    16441    eventos    TABLE     �  CREATE TABLE public.eventos (
    id_evento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    id_organizacion integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone,
    direccion text,
    id_categoria integer NOT NULL,
    capacidad_maxima integer DEFAULT 50,
    voluntarios_inscritos text[],
    requisitos text[],
    estado_evento character varying(20) DEFAULT 'planificado'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.eventos;
       public         heap r       postgres    false            �            1259    16440    eventos_id_evento_seq    SEQUENCE     �   CREATE SEQUENCE public.eventos_id_evento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.eventos_id_evento_seq;
       public               postgres    false    225            B           0    0    eventos_id_evento_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.eventos_id_evento_seq OWNED BY public.eventos.id_evento;
          public               postgres    false    224            �            1259    16410    organizaciones    TABLE     �  CREATE TABLE public.organizaciones (
    id_organizacion integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    nombre_representante character varying(50) NOT NULL,
    correo_representante character varying(100) NOT NULL,
    telefono_representante character varying(15) NOT NULL,
    direccion text,
    estado character varying(20) DEFAULT 'activa'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password_hash character varying(255) NOT NULL,
    sitio_web character varying(200),
    email_verificado boolean DEFAULT false,
    ultimo_acceso timestamp without time zone
);
 "   DROP TABLE public.organizaciones;
       public         heap r       postgres    false            �            1259    16409 "   organizaciones_id_organizacion_seq    SEQUENCE     �   CREATE SEQUENCE public.organizaciones_id_organizacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.organizaciones_id_organizacion_seq;
       public               postgres    false    221            C           0    0 "   organizaciones_id_organizacion_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.organizaciones_id_organizacion_seq OWNED BY public.organizaciones.id_organizacion;
          public               postgres    false    220            �            1259    16583    roles_evento    TABLE     �   CREATE TABLE public.roles_evento (
    id_rol integer NOT NULL,
    id_evento integer NOT NULL,
    nombre_rol text NOT NULL,
    descripcion text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.roles_evento;
       public         heap r       postgres    false            �            1259    16582    roles_evento_id_rol_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_evento_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.roles_evento_id_rol_seq;
       public               postgres    false    227            D           0    0    roles_evento_id_rol_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.roles_evento_id_rol_seq OWNED BY public.roles_evento.id_rol;
          public               postgres    false    226            �            1259    16422    usuarios    TABLE     �  CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    username character varying(30) NOT NULL,
    nombre character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    telefono character varying(15),
    fecha_registro date DEFAULT CURRENT_DATE NOT NULL,
    fecha_nacimiento date,
    direccion text,
    interes_habilidades text[],
    rol_usuario character varying(20) DEFAULT 'voluntario'::character varying,
    estado_cuenta character varying(20) DEFAULT 'activa'::character varying,
    ultimo_acceso timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.usuarios;
       public         heap r       postgres    false            �            1259    16421    usuarios_id_usuario_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.usuarios_id_usuario_seq;
       public               postgres    false    223            E           0    0    usuarios_id_usuario_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;
          public               postgres    false    222            w           2604    16404    categorias_eventos id_categoria    DEFAULT     �   ALTER TABLE ONLY public.categorias_eventos ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_eventos_id_categoria_seq'::regclass);
 N   ALTER TABLE public.categorias_eventos ALTER COLUMN id_categoria DROP DEFAULT;
       public               postgres    false    218    219    219            �           2604    16444    eventos id_evento    DEFAULT     v   ALTER TABLE ONLY public.eventos ALTER COLUMN id_evento SET DEFAULT nextval('public.eventos_id_evento_seq'::regclass);
 @   ALTER TABLE public.eventos ALTER COLUMN id_evento DROP DEFAULT;
       public               postgres    false    225    224    225            z           2604    16413    organizaciones id_organizacion    DEFAULT     �   ALTER TABLE ONLY public.organizaciones ALTER COLUMN id_organizacion SET DEFAULT nextval('public.organizaciones_id_organizacion_seq'::regclass);
 M   ALTER TABLE public.organizaciones ALTER COLUMN id_organizacion DROP DEFAULT;
       public               postgres    false    220    221    221            �           2604    16586    roles_evento id_rol    DEFAULT     z   ALTER TABLE ONLY public.roles_evento ALTER COLUMN id_rol SET DEFAULT nextval('public.roles_evento_id_rol_seq'::regclass);
 B   ALTER TABLE public.roles_evento ALTER COLUMN id_rol DROP DEFAULT;
       public               postgres    false    227    226    227                       2604    16425    usuarios id_usuario    DEFAULT     z   ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);
 B   ALTER TABLE public.usuarios ALTER COLUMN id_usuario DROP DEFAULT;
       public               postgres    false    223    222    223            1          0    16401    categorias_eventos 
   TABLE DATA           g   COPY public.categorias_eventos (id_categoria, nombre, descripcion, created_at, updated_at) FROM stdin;
    public               postgres    false    219   �A       7          0    16441    eventos 
   TABLE DATA           �   COPY public.eventos (id_evento, nombre, descripcion, id_organizacion, fecha_inicio, fecha_fin, hora_inicio, hora_fin, direccion, id_categoria, capacidad_maxima, voluntarios_inscritos, requisitos, estado_evento, created_at, updated_at) FROM stdin;
    public               postgres    false    225   �A       3          0    16410    organizaciones 
   TABLE DATA           �   COPY public.organizaciones (id_organizacion, nombre, descripcion, nombre_representante, correo_representante, telefono_representante, direccion, estado, created_at, updated_at, password_hash, sitio_web, email_verificado, ultimo_acceso) FROM stdin;
    public               postgres    false    221   �A       9          0    16583    roles_evento 
   TABLE DATA           b   COPY public.roles_evento (id_rol, id_evento, nombre_rol, descripcion, fecha_creacion) FROM stdin;
    public               postgres    false    227   KE       5          0    16422    usuarios 
   TABLE DATA           �   COPY public.usuarios (id_usuario, username, nombre, correo, password_hash, telefono, fecha_registro, fecha_nacimiento, direccion, interes_habilidades, rol_usuario, estado_cuenta, ultimo_acceso, created_at, updated_at) FROM stdin;
    public               postgres    false    223   hE       F           0    0 #   categorias_eventos_id_categoria_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.categorias_eventos_id_categoria_seq', 1, false);
          public               postgres    false    218            G           0    0    eventos_id_evento_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.eventos_id_evento_seq', 1, false);
          public               postgres    false    224            H           0    0 "   organizaciones_id_organizacion_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.organizaciones_id_organizacion_seq', 5, true);
          public               postgres    false    220            I           0    0    roles_evento_id_rol_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.roles_evento_id_rol_seq', 1, false);
          public               postgres    false    226            J           0    0    usuarios_id_usuario_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 8, true);
          public               postgres    false    222            �           2606    16408 *   categorias_eventos categorias_eventos_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.categorias_eventos
    ADD CONSTRAINT categorias_eventos_pkey PRIMARY KEY (id_categoria);
 T   ALTER TABLE ONLY public.categorias_eventos DROP CONSTRAINT categorias_eventos_pkey;
       public                 postgres    false    219            �           2606    16453    eventos eventos_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id_evento);
 >   ALTER TABLE ONLY public.eventos DROP CONSTRAINT eventos_pkey;
       public                 postgres    false    225            �           2606    16478 6   organizaciones organizaciones_correo_representante_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.organizaciones
    ADD CONSTRAINT organizaciones_correo_representante_key UNIQUE (correo_representante);
 `   ALTER TABLE ONLY public.organizaciones DROP CONSTRAINT organizaciones_correo_representante_key;
       public                 postgres    false    221            �           2606    16420 "   organizaciones organizaciones_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.organizaciones
    ADD CONSTRAINT organizaciones_pkey PRIMARY KEY (id_organizacion);
 L   ALTER TABLE ONLY public.organizaciones DROP CONSTRAINT organizaciones_pkey;
       public                 postgres    false    221            �           2606    16591    roles_evento roles_evento_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.roles_evento
    ADD CONSTRAINT roles_evento_pkey PRIMARY KEY (id_rol);
 H   ALTER TABLE ONLY public.roles_evento DROP CONSTRAINT roles_evento_pkey;
       public                 postgres    false    227            �           2606    16439    usuarios usuarios_correo_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_correo_key;
       public                 postgres    false    223            �           2606    16435    usuarios usuarios_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public                 postgres    false    223            �           2606    16437    usuarios usuarios_username_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);
 H   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_username_key;
       public                 postgres    false    223            �           2606    16459 !   eventos eventos_id_categoria_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias_eventos(id_categoria);
 K   ALTER TABLE ONLY public.eventos DROP CONSTRAINT eventos_id_categoria_fkey;
       public               postgres    false    219    225    4749            �           2606    16454 $   eventos eventos_id_organizacion_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_id_organizacion_fkey FOREIGN KEY (id_organizacion) REFERENCES public.organizaciones(id_organizacion);
 N   ALTER TABLE ONLY public.eventos DROP CONSTRAINT eventos_id_organizacion_fkey;
       public               postgres    false    221    4753    225            �           2606    16592 (   roles_evento roles_evento_id_evento_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.roles_evento
    ADD CONSTRAINT roles_evento_id_evento_fkey FOREIGN KEY (id_evento) REFERENCES public.eventos(id_evento);
 R   ALTER TABLE ONLY public.roles_evento DROP CONSTRAINT roles_evento_id_evento_fkey;
       public               postgres    false    225    227    4761            1      x������ � �      7      x������ � �      3   @  x�}��~�8�k�*�-1�b�J���:���9�2(�%c[�6Sn��v��b{�f7q%��r���ٶ�Q"�1��� r���IAH��`1p�i�җ�̴g.Z�,c`\d�5��g�>ڷ�A�6�Y��^޵e�hn�4t�ٰ<�ҕ��2�+c���ow͙��c�����GWu�n>�YwU[u��d��u76��;o��̶���$k�jQ�&�yٜJ-¶*�֙���;=�=h<�9IBJ&���0i�R#�k��F�lY�n8�[��Z�Z��[fӨ�'��ۯ�{6���M_��]83�/����w
6o�ɓ����#��?��Q�d�t�������'�������(@�
 2]"�⭖1A"&hV:�U����,�s@`�BHq�n(�Bq�Fq��-0!X�S���<lOR�L!����wTI\�d��3HSɹ$��r*�kH���ۻ�����bH�K�c�������(E�ͼFL׮�V������f˶[��۞�XޏR��&�e;�cc����������=��w��`��w�?����t�{�d܎ذ��^d�ή�Π�ۭ�N���Wܟ�Mh��
��l�n[M��F�~�H�8�J�N�G$z�ɀ�N�
/B�r�L�pAL�e��q���U2����DA�8�ri�@�� �.�N/�ɑ�<��A=�fJ���7���R~�����v��1�X�*�+����E�'m*0��J�,�Į�/ا$���X�*y����G��p �?�9P�����8�c��������һ�����ɟ>Y�?�3,6*��h����8��"o̝$�]����t��{��}�+�ʿN��      9      x������ � �      5   �  x��T�n�8}6_i�6%���yj!�å���H�	�&ͭ�p;��3�1i�(�;kK�Z^{cP��(s��q^��O�����{��2JCezI.����?�]�P�m7���0+9^����&G}��j�Z���I|�1�B���.;<�$,�b�)�^�/�Q���ðC�I�%��alB�[�9�B�B�~��:|�����Y���jI?<���u��ٴ]����j�#e����l�+$�Ц�iO�֭����w-��`�!����D	�qS�@�lv�P�{A"c�pA�P�O`��ǝ���;5;w�P�uV�f�M�ј�U2Tn7� �ٶ������C����(a��4h"Ƒ�g�
���<_Wn^5��!���$��g�Lx�2o����u�oc���}rc�,6��4ަr]dX���:����sE�}��NOM�C�I�����D�HM�lB���~6�E8q̰ea}$
:�&0������Wmګݷ�,�K
	�>~��j�m���fښ<���o��k��L�p~GUm�*D����r���!�"2�1����-���ʸH7��x��jVz����P^������ٟ��	�@�àÈ	�ec�T��\�%��/���Z�]���H�� ����g����|�<��)��Sﱿi��,jo�|�ꏸ�zX��d�LN�z�g������L�!~Dj�'/2��*.Ա2+ԋW�E�ɯ)A�M�@��3P��at�,���%/zP�h�Y��n5$�?v��
yZq��ձZ+���Ε5�u�k��+�-U���7~�觤{�~�=�;�z���Y��{�F9��TЯ	���e".�g�
�n��e�Q�'������-/��Ԯ��2W�t@��u���bc��eJ�zs�t�F��rr��1��=fj�_�ɮ���Eϴ�8<.�%s?/�VS��~�G�}A)ہ�A�DBF�@��f�R��]MU     